import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { LayoutContainer } from '../../../layouts/Default';
import Breadcrumb from '../../../layouts/Breadcrumb';
import { addDays, addMinutes, getPrevMonday } from '../../../services/date';
import { useProject, useSlots } from '../../../services/db';
import { filterObj } from '../../../services/object';
import CreateSlotModal from './CreateSlotModal';
import SlotModal from './SlotModal';

const DEFAULT_SHOW_DAYS = 7;
const DEFAULT_START_HOUR = 8;
const DEFAULT_DAY_HOURS = 10;
const HOUR_ROW_HEIGHT = 50;

const hourStyle = {
  height: `${HOUR_ROW_HEIGHT}px`,
};

const hourDigitStyle = {
  height: `${HOUR_ROW_HEIGHT}px`,
  fontSize: '10px',
  position: 'relative',
  top: '-8px',
  paddingRight: '8px',
};

// Returns evt.offsetY and calculates it if needed
const getOffsetY = (evt) =>
  evt.offsetY ?? evt.clientY - evt.target.getBoundingClientRect().top;

function HourDigit({ children }) {
  return (
    <div style={hourDigitStyle} className="">
      {children}
    </div>
  );
}

function Hour() {
  return <div style={hourStyle} className="cal-hour-row" />;
}

function HourDigits({ startHour, hours }) {
  const digits = [];
  for (let i = 0; i < hours; i++) {
    const hr = startHour + i;
    digits.push(<HourDigit key={hr}>{hr < 10 ? `0${hr}` : hr}:00</HourDigit>);
  }
  return <div>{digits}</div>;
}

function Hours({ hours }) {
  const entries = [];
  for (let i = 0; i < hours; i++) {
    entries.push(<Hour key={i} />);
  }
  return <div>{entries}</div>;
}

function Slot({ slot, onClick }) {
  const style2 = {
    width: '100%',
    borderRadius: '3px',
    zIndex: 5,
    position: 'absolute',
    cursor: 'pointer',
  };
  const start = new Date(slot.starts).getHours() - 8;
  style2.top = `${start * HOUR_ROW_HEIGHT}px`;
  const duration = (slot.ends - slot.starts) / 3600000;
  style2.height = `${duration * HOUR_ROW_HEIGHT}px`;
  const handleClick = (evt) => {
    evt.stopPropagation();
    onClick();
  };
  return (
    <div style={style2} className="cal-slot" onClick={handleClick}>
      {JSON.stringify(slot.persons)}
    </div>
  );
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function DayTitle({ date }) {
  const { t } = useTranslation();
  return (
    <div
      className="text-center"
      style={{ position: 'relative', top: '-2.5em' }}
    >
      {t(WEEKDAYS[date.getDay()])} {date.getDate()}
    </div>
  );
}

function DayCol({ starts, slots, firstHour, onSlotClick, onTimeClick }) {
  const myStyle = {
    position: 'relative',
    width: 'calc(100% - 1em)',
    height: '100%',
    paddingRight: '3em',
    fontSize: '12px',
  };
  const ends = addDays(starts, 1);
  const filteredSlots = filterObj(slots, ([id, slot]) => {
    return slot.starts >= starts.getTime() && slot.ends < ends.getTime();
  });
  return (
    <div
      className="cal-day-col"
      onClick={(evt) => {
        evt.stopPropagation();
        const offsetY = getOffsetY(evt);
        const hrs = Math.floor(offsetY / HOUR_ROW_HEIGHT);
        const time = addMinutes(starts, (firstHour + hrs) * 60);
        onTimeClick(time);
      }}
    >
      {/*<DayTitle date={starts} />*/}
      <div style={myStyle} className="text-white">
        {Object.keys(filteredSlots).map((slotId) => (
          <Slot
            key={slotId}
            slot={filteredSlots[slotId]}
            onClick={() => onSlotClick(slotId)}
          />
        ))}
      </div>
    </div>
  );
}

function Calendar({
  starts,
  ends,
  locationId,
  slots,
  days,
  onSlotClick,
  onTimeClick,
}) {
  const dayStarts = [];
  for (let i = 0; i < days; i++) {
    dayStarts.push(addDays(starts, i));
  }

  const filteredSlots = filterObj(slots, ([id, slot]) => {
    if (slot.locationId !== locationId) {
      return false;
    }
    return slot.starts >= starts.getTime() && slot.ends < ends.getTime();
  });

  return (
    <div className="cal-container">
      <div className="cal-content pt-5">
        <HourDigits startHour={DEFAULT_START_HOUR} hours={DEFAULT_DAY_HOURS} />
        <Hours hours={DEFAULT_DAY_HOURS} />
        {dayStarts.map((dayStart) => (
          <DayCol
            key={dayStart.getTime()}
            starts={dayStart}
            slots={filteredSlots}
            firstHour={DEFAULT_START_HOUR}
            onSlotClick={onSlotClick}
            onTimeClick={onTimeClick}
          />
        ))}
      </div>
    </div>
  );
}

function MyBreadcrumb({ project }) {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={project?.name}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item>{project?.name}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function Project() {
  const { projectId } = useParams();
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [starts, setStarts] = useState(getPrevMonday());
  const [showDays, setShowDays] = useState(DEFAULT_SHOW_DAYS);
  const [ends, setEnds] = useState(addDays(starts, showDays));
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedLocation, setSelectedLocation] = useState();

  const { data: project } = useProject(projectId);
  const { docs: slots } = useSlots(projectId, starts, ends);

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
  return (
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb project={project} />}>
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
                    <Calendar
                      starts={starts}
                      ends={ends}
                      project={project}
                      locationId={locationId}
                      slots={slots}
                      days={showDays}
                      onSlotClick={(slotId) => {
                        setSelectedSlot(slotId);
                        setShowSlotModal(true);
                      }}
                      onTimeClick={(time) => {
                        setSelectedTime(time);
                        setShowCreateSlotModal(true);
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
        slot={slots?.[selectedSlot]}
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
