import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { MONTHS, WEEKDAYS, addDays, addMinutes } from '../../services/date';
import { getNameInitials } from '../../services/string';
import { filterObj } from '../../services/object';

const DEFAULT_START_HOUR = 8;
const DEFAULT_DAY_HOURS = 10;
const HOUR_ROW_HEIGHT = 50;

const hourStyle = {
  height: `${HOUR_ROW_HEIGHT}px`,
};

// Returns evt.offsetY and calculates it if needed
const getOffsetY = (evt) =>
  evt.offsetY ?? evt.clientY - evt.target.getBoundingClientRect().top;

function HourDigit({ children }) {
  return (
    <div className="cal-hour-number" style={hourStyle}>
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

const getPartners = (slotRequest, personId) => {
  return Object.keys(slotRequest?.persons ?? {})
    .filter((id) => id !== personId)
    .map((id) => getNameInitials(slotRequest.persons[id].name));
};

function Slot({ slot, slotRequest, personId, onClick }) {
  const start = new Date(slot.starts).getHours() - 8;
  const duration = (slot.ends - slot.starts) / 3600000;
  const style = {
    top: `${start * HOUR_ROW_HEIGHT}px`,
    height: `${duration * HOUR_ROW_HEIGHT}px`,
  };
  const handleClick = (evt) => {
    evt.stopPropagation();
    onClick();
  };
  let className = 'cal-slot ';
  if (slotRequest) {
    className += 'bg-warning bg-gradient';
  } else {
    className += 'bg-light text-dark border';
  }
  const partners = getPartners(slotRequest, personId);
  return (
    <div className={className} style={style} onClick={handleClick}>
      {JSON.stringify(slot.persons)}
      {partners.length > 0 && <span> + {partners.join(', ')}</span>}
    </div>
  );
}

function DayTitle({ date }) {
  const { t } = useTranslation();
  return (
    <div className="cal-day-col-title w-100 text-center">
      {t(WEEKDAYS[date.getDay()])}
      <br />
      {date.getDate()}
    </div>
  );
}

const findSlotRequestId = (slotId, requests) =>
  Object.keys(requests).find((id) => requests[id].slotId === slotId);

function DayCol({
  starts,
  slots,
  slotRequests,
  firstHour,
  personId,
  onSlotClick,
  onTimeClick,
}) {
  const ends = addDays(starts, 1);
  const filteredSlots = filterObj(
    slots,
    ([id, slot]) =>
      slot.starts >= starts.getTime() && slot.ends < ends.getTime(),
  );

  return (
    <div
      className="cal-day-col"
      onClick={(evt) => {
        if (onTimeClick) {
          evt.stopPropagation();
          const offsetY = getOffsetY(evt);
          const hrs = Math.floor(offsetY / HOUR_ROW_HEIGHT);
          const time = addMinutes(starts, (firstHour + hrs) * 60);
          onTimeClick(time);
        }
      }}
    >
      <DayTitle date={starts} />
      <div className="cal-day-col-content text-white">
        {Object.keys(filteredSlots).map((slotId) => {
          const slotRequestId = findSlotRequestId(slotId, slotRequests);
          return (
            <Slot
              key={slotId}
              slot={filteredSlots[slotId]}
              slotRequestId={slotRequestId}
              slotRequest={slotRequests[slotRequestId]}
              personId={personId}
              onClick={() => onSlotClick(slotId)}
            />
          );
        })}
      </div>
    </div>
  );
}

function Navigation({ month, onPrev, onNext }) {
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-between align-items-center cal-navf">
      <Button
        onClick={onPrev}
        className="shadow-none text-dark bg-white text-lg mt-1 mb-2"
      >
        <FaAngleLeft />
      </Button>
      <div>
        {t(MONTHS[month.getMonth()])} {month.getFullYear()}
      </div>
      <Button
        onClick={onNext}
        className="shadow-none text-dark bg-white text-lg mt-1 mb-2"
      >
        <FaAngleRight />
      </Button>
    </div>
  );
}

export default function SlotCalendar({
  starts,
  ends,
  locationId,
  slots,
  slotRequests,
  days,
  personId,
  onSlotClick,
  onTimeClick,
  onMovePrev,
  onMoveNext,
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
    <>
      <Navigation month={starts} onPrev={onMovePrev} onNext={onMoveNext} />
      <div className="cal-container">
        <div className="cal-content">
          <HourDigits
            startHour={DEFAULT_START_HOUR}
            hours={DEFAULT_DAY_HOURS}
          />
          <Hours hours={DEFAULT_DAY_HOURS} />
          {dayStarts.map((dayStart) => (
            <DayCol
              key={dayStart.getTime()}
              starts={dayStart}
              slots={filteredSlots}
              slotRequests={slotRequests}
              firstHour={DEFAULT_START_HOUR}
              personId={personId}
              onSlotClick={onSlotClick}
              onTimeClick={onTimeClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
