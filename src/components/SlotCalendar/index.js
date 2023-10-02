import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import { MONTHS, WEEKDAYS, addDays, addMinutes } from '../../services/date';
import { filterObj } from '../../services/object';
import { filterSlotsByRange } from '../../services/slot';
import { HOUR_ROW_HEIGHT } from './constants';
import { AdminSlot, Slot } from './Slot';

const DEFAULT_START_HOUR = 8;
const DEFAULT_DAY_HOURS = 10;

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
  admin,
  onSlotClick,
  onTimeClick,
}) {
  const ends = addDays(starts, 1);
  const filteredSlots = filterSlotsByRange(slots, starts, ends);

  const renderSlot = (slotId) => {
    if (admin) {
      return (
        <AdminSlot
          key={slotId}
          slotId={slotId}
          slot={slots[slotId]}
          slotRequests={slotRequests}
          personId={personId}
          onClick={() => onSlotClick(slotId)}
        />
      );
    }
    const slotRequestId = findSlotRequestId(slotId, slotRequests);
    return (
      <Slot
        key={slotId}
        slot={slots[slotId]}
        slotRequestId={slotRequestId}
        slotRequest={slotRequests[slotRequestId]}
        personId={personId}
        onClick={() => onSlotClick(slotId)}
      />
    );
  };

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
        {Object.keys(filteredSlots).map((id) => renderSlot(id))}
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
  admin,
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
              admin={admin}
              onSlotClick={onSlotClick}
              onTimeClick={onTimeClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
