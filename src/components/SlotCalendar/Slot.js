import { useMemo } from 'react';
import { FaCheck } from 'react-icons/fa';

import { nameSorter } from '../../services/string';

import { getNameInitials } from '../../services/string';
import { HAPPY_SLOT_PERSON_COUNT, HOUR_ROW_HEIGHT } from './constants';

const getAssignedNames = (slot) => {
  return Object.values(slot?.persons ?? {})
    .map((person) => person.name)
    .sort(nameSorter)
    .map((name) => getNameInitials(name));
};

const getRequestPartners = (slotRequest, personId) => {
  return Object.keys(slotRequest?.persons ?? {})
    .filter((id) => id !== personId)
    .map((id) => slotRequest.persons[id].name)
    .sort(nameSorter)
    .map((name) => getNameInitials(name));
};

function BigCheck() {
  return (
    <div className="text-lg text-center d-flex justify-content-center align-items-center h-100">
      <FaCheck />
    </div>
  );
}

function SlotContainer({ slot, className, onClick, children }) {
  const handleClick = (evt) => {
    evt.stopPropagation();
    onClick();
  };
  const start = new Date(slot.starts).getHours() - 8;
  const duration = (slot.ends - slot.starts) / 3600000;
  const style = {
    top: `${start * HOUR_ROW_HEIGHT}px`,
    height: `${duration * HOUR_ROW_HEIGHT}px`,
  };
  return (
    <div className={className} style={style} onClick={handleClick}>
      {children}
    </div>
  );
}

export function Slot({ slot, slotRequest, personId, onClick }) {
  const currentIsAssigned = !!slot.persons?.[personId];
  const assignedNames = getAssignedNames(slot);
  const isHappySlot = assignedNames.length >= HAPPY_SLOT_PERSON_COUNT;
  let className = 'cal-slot cursor-pointer ';
  if (currentIsAssigned) {
    // current person is assigned to this slot
    className += 'bg-success bg-gradient';
  } else if (isHappySlot) {
    // this slot has enough assignments
    className += 'bg-primary bg-gradient';
  } else if (slotRequest) {
    // current person has a request for this slot
    className += 'bg-warning bg-gradient';
  } else {
    // free slot
    className += 'bg-light text-dark border';
  }
  const reqPartners = getRequestPartners(slotRequest, personId);
  return (
    <SlotContainer slot={slot} className={className} onClick={onClick}>
      {currentIsAssigned ? (
        <BigCheck />
      ) : (
        <>
          {assignedNames.length > 0 && <div>{assignedNames.join(', ')}</div>}
          {!isHappySlot && reqPartners.length > 0 && (
            <div> + {reqPartners.join(', ')}</div>
          )}
        </>
      )}
    </SlotContainer>
  );
}

export function AdminSlot({ slotId, slot, slotRequests, onClick }) {
  const isHappySlot =
    Object.values(slot?.persons ?? {}).length >= HAPPY_SLOT_PERSON_COUNT;
  let className = 'cal-slot cursor-pointer ';
  if (isHappySlot) {
    // this slot has enough assignments
    className += 'bg-primary bg-gradient';
  } else {
    // free slot
    className += 'bg-light text-dark border';
  }
  const requestCount = useMemo(
    () =>
      Object.values(slotRequests).filter((req) => req.slotId === slotId).length,
    [slotId, slotRequests],
  );
  return (
    <SlotContainer slot={slot} className={className} onClick={onClick}>
      <div className="text-center d-flex justify-content-center align-items-center h-100">
        {requestCount}
      </div>
    </SlotContainer>
  );
}
