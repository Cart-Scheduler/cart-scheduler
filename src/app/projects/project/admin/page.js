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
import { FaEllipsisV, FaUsers } from 'react-icons/fa';

import {
  useRequestIndexes,
  useSlotIndexes,
} from '../../../../services/indexing';
import {
  useJoinRequests,
  usePersonId,
  useProject,
  useProjectMembers,
  useSlots,
  useSlotRequestsByProject,
} from '../../../../services/db';
import { LayoutContainer } from '../../../../layouts/Default';
import Breadcrumb from '../../../../layouts/Breadcrumb';
import { addDays, getPrevMonday } from '../../../../services/date';
import { filterObj } from '../../../../services/object';
import SlotCalendar from '../../../../components/SlotCalendar';
import { HAPPY_SLOT_PERSON_COUNT } from '../../../../components/SlotCalendar/constants';
import CreateLocation from './CreateLocation';
import CreateSlotModal from './CreateSlotModal';
import EditLocationModal from './EditLocationModal';
import RemoveLocationModal from './RemoveLocationModal';
import SelectedSlotRequests from './SelectedSlotRequests';
import SlotModal from './SlotModal';

const DEFAULT_SHOW_DAYS = 7;
const LOCATION_ID_ADD = 'add';

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

export default function ProjectAdminPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showRemoveLocationModal, setShowRemoveLocationModal] = useState(false);
  const [starts, setStarts] = useState(getPrevMonday());
  const [showDays, setShowDays] = useState(DEFAULT_SHOW_DAYS);
  const [ends, setEnds] = useState(addDays(starts, showDays));
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedReqs, setSelectedReqs] = useState({});
  const { t } = useTranslation();

  const personId = usePersonId();
  const { data: project } = useProject(projectId);
  const { docs: slots } = useSlots(projectId, starts, ends);
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

  const [aiRange, setAiRange] = useState([
    new Date(2023, 0, 1).getTime(),
    new Date(2023, 8, 2).getTime(),
  ]);
  const { slotsByPerson, draftSlotsByPerson } = useSlotIndexes(
    slots,
    selectedReqs,
    aiRange,
  );
  const { reqsByPerson } = useRequestIndexes(
    slotRequests,
    slots,
    selectedReqs,
    aiRange,
    HAPPY_SLOT_PERSON_COUNT,
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

  return (
    <LayoutContainer
      fluid
      breadcrumb={<MyBreadcrumb projectId={projectId} project={project} />}
    >
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header>
              <div className="float-end">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(`/projects/${projectId}/admin/members`)
                  }
                  title={t('Members')}
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
                            onClick={() => setShowRemoveLocationModal(true)}
                          >
                            {t('Remove')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <SlotCalendar
                      starts={starts}
                      ends={ends}
                      project={project}
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
        locationName={project?.locations[selectedLocation]?.name}
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
  );
}
