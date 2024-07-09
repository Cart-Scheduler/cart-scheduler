import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ReactMarkdown from 'react-markdown';

import { LayoutContainer } from '../../../layouts/Default';
import Breadcrumb from '../../../layouts/Breadcrumb';
import { addDays, getPrevMonday } from '../../../services/date';
import {
  usePersonId,
  useProject,
  useProjectMembers,
  useSlots,
  useSlotRequests,
} from '../../../services/db';
import SlotCalendar from '../../../components/SlotCalendar';
import AssignmentList from './AssignmentList';
import ReservationModal from './ReservationModal';
import SlotRequestModal from './SlotRequestModal';
import { ProjectContext } from '../../../components/ProjectContext';

const DEFAULT_SHOW_DAYS = 7;

const findSlotRequestId = (slotId, personId, requests) =>
  Object.keys(requests).find(
    (id) =>
      requests[id].slotId === slotId &&
      requests[id].persons[personId] !== undefined,
  );

function MyBreadcrumb({ project }) {
  const { t } = useTranslation();
  return (
    <Breadcrumb>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item>{project?.name}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

function Info({ info }) {
  return (
    <div className="project-info">
      <ReactMarkdown>{info}</ReactMarkdown>
    </div>
  );
}

function Guide({ project }) {
  // build help guide text depending on how many locations we have
  const { t } = useTranslation();
  const locationText = t(
    'First choose the cart location. The calendar for the selected location is below.',
  );
  const calendarText = t(
    "If you don't see the whole week in calendar, scroll it horizontally. You can request or reserve a cart shift by pressing a gray box.",
  );
  let txt;
  if (!project?.locations) {
    txt = t('This project does not have any cart locations yet.');
  } else if (Object.keys(project.locations).length > 1) {
    // multiple locations
    txt = `${locationText} ${calendarText}`;
  } else {
    // single location
    txt = calendarText;
  }
  return (
    <div className="d-flex p-4 mb-4 bg-gray-100 border-radius-lg text-sm">
      {txt}
    </div>
  );
}

export default function Project() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [starts, setStarts] = useState(getPrevMonday());
  const [showDays, setShowDays] = useState(DEFAULT_SHOW_DAYS);
  const [ends, setEnds] = useState(addDays(starts, showDays));
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedLocation, setSelectedLocation] = useState();
  const { t } = useTranslation();

  const personId = usePersonId();
  const { data: project } = useProject(projectId);
  const { docs: slots } = useSlots(projectId, starts, ends);
  const { docs: slotRequests } = useSlotRequests(personId);
  const membersDoc = useProjectMembers(projectId);
  const isAdmin = personId && membersDoc?.members[personId].admin;

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
    if (!selectedLocation) {
      setSelectedLocation(locations.length > 0 ? locations[0] : undefined);
    }
  }, [selectedLocation, locations]);

  const projectCtx = useMemo(
    () => ({
      projectId,
      project,
    }),
    [projectId, project],
  );

  if (!project || !locations) {
    return null;
  }
  const slotRequestId = findSlotRequestId(selectedSlot, personId, slotRequests);

  return (
    <ProjectContext.Provider value={projectCtx}>
      <LayoutContainer fluid breadcrumb={<MyBreadcrumb project={project} />}>
        <Row>
          <Col className="px-0 px-lg-3">
            <Card className="mb-4">
              <Card.Header className="pb-0">
                {isAdmin && (
                  <div className="float-end">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/projects/${projectId}/admin`)}
                    >
                      {t('Admin')}
                    </Button>
                  </div>
                )}
                <h6>{project?.name}</h6>
                {project?.info && <Info info={project.info} />}
              </Card.Header>
              <Card.Body className="ps-2 pe-2">
                <Guide project={project} />
                <AssignmentList personId={personId} projectId={projectId} />
                {project.locations && (
                  <Tabs
                    activeKey={selectedLocation}
                    onSelect={(loc) => setSelectedLocation(loc)}
                    id="location-tabs"
                    className="location-tabs mb-3"
                    justify
                  >
                    {locations.map((locationId) => (
                      <Tab
                        key={locationId}
                        eventKey={locationId}
                        title={project.locations[locationId].name}
                      >
                        <SlotCalendar
                          starts={starts}
                          ends={ends}
                          locationId={locationId}
                          slots={slots}
                          slotRequests={slotRequests}
                          days={showDays}
                          personId={personId}
                          onSlotClick={(slotId) => {
                            setSelectedSlot(slotId);
                            if (slots?.[slotId]?.direct) {
                              setShowReservationModal(true);
                            } else {
                              setShowSlotModal(true);
                            }
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
                  </Tabs>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <SlotRequestModal
          show={showSlotModal}
          onHide={() => setShowSlotModal(false)}
          projectId={projectId}
          locationName={
            project?.locations?.[selectedLocation]?.name || 'Default Location'
          }
          slotId={selectedSlot}
          slotRequestId={slotRequestId}
          slotRequest={slotRequests[slotRequestId]}
          slot={slots?.[selectedSlot]}
          members={membersDoc?.members}
        />
        <ReservationModal
          show={showReservationModal}
          onHide={() => setShowReservationModal(false)}
          projectId={projectId}
          locationName={
            project?.locations?.[selectedLocation]?.name || 'Default Location'
          }
          slotId={selectedSlot}
          slot={slots?.[selectedSlot]}
          members={membersDoc?.members}
        />
      </LayoutContainer>
    </ProjectContext.Provider>
  );
}
