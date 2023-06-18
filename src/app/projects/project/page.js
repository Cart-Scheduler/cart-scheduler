import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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
import SlotRequestModal from './SlotRequestModal';

const DEFAULT_SHOW_DAYS = 7;

const findSlotRequestId = (slotId, requests) =>
  Object.keys(requests).find((id) => requests[id].slotId === slotId);

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

function Info() {
  const { t } = useTranslation();
  return (
    <div className="d-flex p-4 mb-4 bg-gray-100 border-radius-lg text-sm">
      {t(
        'First choose the cart location. The calendar for the selected location is below. You can request a cart shift by pressing a gray box.',
      )}
    </div>
  );
}

export default function Project() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [showSlotModal, setShowSlotModal] = useState(false);
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
  if (!project) {
    return null;
  }
  const slotRequestId = findSlotRequestId(selectedSlot, slotRequests);

  return (
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb project={project} />}>
      <Row>
        <Col className="ps-0 pe-0">
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
            </Card.Header>
            <Card.Body>
              <Info />
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
      <SlotRequestModal
        show={showSlotModal}
        onHide={() => setShowSlotModal(false)}
        projectId={projectId}
        locationName={project?.locations[selectedLocation]?.name}
        slotId={selectedSlot}
        slotRequestId={slotRequestId}
        slotRequest={slotRequests[slotRequestId]}
        slot={slots?.[selectedSlot]}
        members={membersDoc?.members}
      />
    </LayoutContainer>
  );
}
