import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useParams } from 'react-router-dom';

import {
  usePersonId,
  useProject,
  useProjectMembers,
  useSlots,
  useSlotRequests,
} from '../../../../services/db';
import { LayoutContainer } from '../../../../layouts/Default';
import Breadcrumb from '../../../../layouts/Breadcrumb';
import { addDays, getPrevMonday } from '../../../../services/date';
import SlotCalendar from '../../../../components/SlotCalendar';
import CreateSlotModal from './CreateSlotModal';
import SlotModal from './SlotModal';

const DEFAULT_SHOW_DAYS = 7;

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

export default function ProjectAdminPage() {
  const { projectId } = useParams();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [starts, setStarts] = useState(getPrevMonday());
  const [showDays, setShowDays] = useState(DEFAULT_SHOW_DAYS);
  const [ends, setEnds] = useState(addDays(starts, showDays));
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const personId = usePersonId();
  const { data: project } = useProject(projectId);
  const { docs: slots } = useSlots(projectId, starts, ends);
  const { docs: slotRequests } = useSlotRequests(personId);
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
    if (!selectedLocation) {
      setSelectedLocation(locations.length > 0 ? locations[0] : undefined);
    }
  }, [selectedLocation, locations]);
  if (!project) {
    return null;
  }
  const slotRequestId = findSlotRequestId(selectedSlot, slotRequests);

  return (
    <LayoutContainer
      fluid
      breadcrumb={<MyBreadcrumb projectId={projectId} project={project} />}
    >
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header>
              <h6>{project?.name}</h6>
            </Card.Header>
            <Card.Body>
              <Tabs
                activeKey={selectedLocation}
                onSelect={(loc) => setSelectedLocation(loc)}
                id="calendar-tabs"
                className="mb-3"
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
                      project={project}
                      locationId={locationId}
                      slots={slots}
                      slotRequests={slotRequests}
                      days={showDays}
                      personId={personId}
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
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <SlotModal
        show={showSlotModal}
        onHide={() => setShowSlotModal(false)}
        projectId={projectId}
        slotId={selectedSlot}
        slotRequestId={slotRequestId}
        slotRequest={slotRequests[slotRequestId]}
        slot={slots?.[selectedSlot]}
        members={membersDoc?.members}
      />
      <CreateSlotModal
        show={showCreateSlotModal}
        onHide={() => setShowCreateSlotModal(false)}
        projectId={projectId}
        locationId={selectedLocation}
        starts={selectedTime}
      />
    </LayoutContainer>
  );
}
