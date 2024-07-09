import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FaEllipsisV, FaPen, FaUsers } from 'react-icons/fa';
import startOfWeek from 'date-fns/startOfWeek';

import {
  useRequestIndexes,
  useSlotIndexes,
} from '../../../../services/indexing';
import { getWeekStart } from '../../../../services/date';
import {
  useJoinRequests,
  usePersonId,
  useProject,
  useProjectMembers,
  useSlots,
  useSlotRequestsByProject,
} from '../../../../services/db';
import { LayoutContainer } from '../../../../layouts/Default';
import { ProjectContext } from '../../../../components/ProjectContext';
import Breadcrumb from '../../../../layouts/Breadcrumb';
import { addDays, getPrevMonday } from '../../../../services/date';
import { filterObj } from '../../../../services/object';
import { copySlots, pasteSlots } from '../../../../services/slot';
import SlotCalendar from '../../../../components/SlotCalendar';
import { HAPPY_SLOT_PERSON_COUNT } from '../../../../components/SlotCalendar/constants';
import MonthCalendar from './MonthCalendar';
import CreateLocation from './CreateLocation';
import CreateSlotModal from './CreateSlotModal';
import EditLocationModal from './EditLocationModal';
import EditProjectModal from './EditProjectModal';
import RemoveLocationModal from './RemoveLocationModal';
import SelectedSlotRequests from './SelectedSlotRequests';
import SlotModal from './SlotModal';

const DEFAULT_SHOW_DAYS = 7;
const LOCATION_ID_ADD = 'add';

// Extends starts-ends date range by days so that context data is
// fetched for decision-making.
const DATA_RANGE_EXTENSION = 30;

const findSlotRequestId = (slotId, requests) =>
  Object.keys(requests).find((id) => requests[id].slotId === slotId);

function MyBreadcrumb({ projectId, project }) {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={`${t('Admin')}: ${project?.name}`}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item to={`/projects/${projectId}`}>
        {project?.name}
      </Breadcrumb.Item>
      <Breadcrumb.Item>{t('Admin')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

function RequestBadge({ projectId }) {
  const { docs } = useJoinRequests(projectId);
  if (!docs || docs.length === 0) {
    return null;
  }
  return <Badge bg="danger">{docs.length}</Badge>;
}

const LocationMenuToggle = forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    className="btn btn-link text-secondary mb-0"
    onClick={onClick}
  >
    {children}
  </button>
));

// Extends given date range by given days, both backward and forward.
function extendRange(range, days) {
  const start = new Date(range[0]);
  const end = new Date(range[1]);
  return [addDays(start, 0 - days), addDays(end, days)];
}

export default function ProjectAdminPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showRemoveLocationModal, setShowRemoveLocationModal] = useState(false);
  const [starts, setStarts] = useState(getPrevMonday());
  const [showDays, setShowDays] = useState(DEFAULT_SHOW_DAYS);
  const [ends, setEnds] = useState(addDays(starts, showDays));
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedReqs, setSelectedReqs] = useState({});
  const { t } = useTranslation();

  // Date range for the data: slots and slotRequests.
  // It should be larger range than starts-ends because admin
  // wants to know context from other slotRequests for decision making.
  const [dataRange, setDataRange] = useState(() => [new Date(), new Date()]);

  const personId = usePersonId();
  const { data: project } = useProject(projectId);
  const { docs: slots } = useSlots(projectId, dataRange[0], dataRange[1]);
  const { docs: slotRequests } = useSlotRequestsByProject(projectId);
  const membersDoc = useProjectMembers(projectId);

  const locations = useMemo(() => {
    if (project?.locations) {
      const ids = Object.keys(project.locations);
      ids.sort(
        (a, b) => project.locations[a].order - project.locations[b].order,
      );
      return ids;
    }
    return [];
  }, [project]);

  useEffect(() => {
    setSelectedLocation((loc) => {
      if (project?.locations && loc === undefined) {
        if (locations.length > 0) {
          return locations[0];
        }
        return LOCATION_ID_ADD;
      }
      return loc;
    });
  }, [locations, project]);

  const filteredReqs = useMemo(
    () => filterObj(slotRequests, ([id, doc]) => doc.slotId === selectedSlot),
    [selectedSlot, slotRequests],
  );

  const { slotsByPerson, draftSlotsByPerson } = useSlotIndexes(
    slots,
    selectedReqs,
    dataRange,
  );
  const { reqsByPerson } = useRequestIndexes(
    slotRequests,
    slots,
    dataRange,
    HAPPY_SLOT_PERSON_COUNT,
  );

  const startsTime = starts.getTime();
  const endsTime = ends.getTime();
  useEffect(() => {
    const newDataRange = extendRange(
      [startsTime, endsTime],
      DATA_RANGE_EXTENSION,
    );
    setDataRange(newDataRange);
  }, [startsTime, endsTime]);

  const projectCtx = useMemo(
    () => ({
      projectId,
      project,
      reqsByPerson,
    }),
    [projectId, project, reqsByPerson],
  );

  if (!project) {
    return null;
  }

  const slotRequestId = findSlotRequestId(selectedSlot, slotRequests);

  const handleRequestToggle = (reqId, req) => {
    const newSelected = { ...selectedReqs };
    if (selectedReqs[reqId]) {
      delete newSelected[reqId];
    } else {
      newSelected[reqId] = req;
    }
    setSelectedReqs(newSelected);
  };

  const selectAnotherLocation = () => {
    if (locations && locations.length > 0) {
      const idx = locations.indexOf(selectedLocation);
      if (locations.length === 1) {
        setSelectedLocation(LOCATION_ID_ADD);
      } else if (idx === locations.length - 1) {
        setSelectedLocation(locations[idx - 1]);
      } else {
        setSelectedLocation(locations[idx + 1]);
      }
    }
  };

  const handleMonthDaySelect = (date) => {
    const newStarts = startOfWeek(date, {
      weekStartsOn: getWeekStart(),
    });
    setStarts(newStarts);
    setEnds(addDays(newStarts, showDays));
  };

  return (
    <ProjectContext.Provider value={projectCtx}>
      <LayoutContainer
        fluid
        breadcrumb={<MyBreadcrumb projectId={projectId} project={project} />}
      >
        <Row>
          <Col className="px-0 px-lg-3">
            <Card className="mb-4">
              <Card.Header>
                <div className="float-end h-2-5em">
                  <Button
                    size="sm"
                    onClick={() => setShowEditProjectModal(true)}
                    title={t('Modify project')}
                    className="ms-2 h-100 px-4"
                  >
                    <FaPen size={18} />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/projects/${projectId}/admin/members`)
                    }
                    title={t('Members')}
                    className="ms-2 h-100 px-4"
                  >
                    <FaUsers size={24} />
                    <RequestBadge projectId={projectId} />
                  </Button>
                </div>
                <h6>{project?.name}</h6>
              </Card.Header>
              <Card.Body>
                <Tabs
                  activeKey={selectedLocation}
                  onSelect={(loc) => setSelectedLocation(loc)}
                  id="location-tabs-admin"
                  className="location-tabs location-tabs-admin mb-3"
                  justify
                >
                  {locations.map((locationId) => (
                    <Tab
                      key={locationId}
                      eventKey={locationId}
                      title={project.locations[locationId].name}
                    >
                      <div className="text-end">
                        <Dropdown>
                          <Dropdown.Toggle
                            as={LocationMenuToggle}
                            id={`loc-${locationId}-menu`}
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              as="button"
                              onClick={() => setShowEditLocationModal(true)}
                            >
                              {t('Modify location')}
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                copySlots(slots, locationId, starts, ends)
                              }
                            >
                              {t('Copy slots')}
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() =>
                                pasteSlots(projectId, locationId, slots, starts)
                              }
                            >
                              {t('Paste slots')}
                            </Dropdown.Item>
                            <Dropdown.Item
                              as="button"
                              onClick={() => setShowRemoveLocationModal(true)}
                            >
                              {t('Remove')}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <Row>
                        <Col md={6} xl={3}>
                          <MonthCalendar
                            starts={starts}
                            ends={ends}
                            onDaySelect={handleMonthDaySelect}
                          />
                        </Col>
                        <Col md={12} xl={9}>
                          <SlotCalendar
                            starts={starts}
                            ends={ends}
                            locationId={locationId}
                            slots={slots}
                            slotRequests={slotRequests}
                            days={showDays}
                            personId={personId}
                            admin
                            onSlotClick={(slotId) => {
                              setSelectedSlot(slotId);
                              setShowSlotModal(true);
                            }}
                            onTimeClick={(time) => {
                              setSelectedTime(time);
                              setShowCreateSlotModal(true);
                            }}
                            onMovePrev={() => {
                              setStarts(addDays(starts, 0 - showDays));
                              setEnds(addDays(ends, 0 - showDays));
                            }}
                            onMoveNext={() => {
                              setStarts(addDays(starts, showDays));
                              setEnds(addDays(ends, showDays));
                            }}
                          />
                        </Col>
                      </Row>
                    </Tab>
                  ))}
                  <Tab
                    eventKey={LOCATION_ID_ADD}
                    title="+"
                    tabAttrs={{ title: t('New location') }}
                  >
                    <CreateLocation
                      projectId={projectId}
                      project={project}
                      onCreated={(loc) => setSelectedLocation(loc)}
                    />
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <SelectedSlotRequests
          projectId={projectId}
          slotRequests={selectedReqs}
          onReset={() => setSelectedReqs({})}
        />

        <SlotModal
          show={showSlotModal}
          onHide={() => setShowSlotModal(false)}
          projectId={projectId}
          slotId={selectedSlot}
          slotRequestId={slotRequestId}
          slotRequest={slotRequests[slotRequestId]}
          slot={slots?.[selectedSlot]}
          slots={slots}
          slotRequests={filteredReqs}
          locationName={project?.locations?.[selectedLocation]?.name}
          members={membersDoc?.members}
          selectedRequests={selectedReqs}
          slotsByPerson={slotsByPerson}
          draftSlotsByPerson={draftSlotsByPerson}
          reqsByPerson={reqsByPerson}
          onRequestToggle={handleRequestToggle}
        />
        <CreateSlotModal
          show={showCreateSlotModal}
          onHide={() => setShowCreateSlotModal(false)}
          projectId={projectId}
          locationId={selectedLocation}
          starts={selectedTime}
        />
        <EditLocationModal
          show={showEditLocationModal}
          onHide={() => setShowEditLocationModal(false)}
          projectId={projectId}
          project={project}
          locationId={selectedLocation}
        />
        <EditProjectModal
          show={showEditProjectModal}
          onHide={() => setShowEditProjectModal(false)}
          projectId={projectId}
          project={project}
        />
        <RemoveLocationModal
          show={showRemoveLocationModal}
          onHide={() => setShowRemoveLocationModal(false)}
          projectId={projectId}
          project={project}
          locationId={selectedLocation}
          onDeleted={() => {
            selectAnotherLocation();
            setShowRemoveLocationModal(false);
          }}
        />
      </LayoutContainer>
    </ProjectContext.Provider>
  );
}
