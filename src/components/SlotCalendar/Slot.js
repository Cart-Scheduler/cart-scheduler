import { useContext, useMemo } from 'react';
import Badge from 'react-bootstrap/Badge';
import { FaCheck } from 'react-icons/fa';

import { nameSorter } from '../../services/string';

import { getNameInitials } from '../../services/string';
import {
  HAPPY_SLOT_PERSON_COUNT,
  HOUR_ROW_HEIGHT,
  IMPORTANT_REQUEST_THRESHOLD,
} from './constants';
import { ProjectContext } from '../ProjectContext';

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

const slotRequestContainsPerson = (slotRequest, personId) =>
  slotRequest?.persons?.[personId] !== undefined;

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
  const date = new Date(slot.starts);
  const start = date.getHours() - 8 + date.getMinutes() / 60;
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
  const isOwnRequest = slotRequestContainsPerson(slotRequest, personId);
  let className = 'cal-slot cursor-pointer ';
  if (currentIsAssigned) {
    // current person is assigned to this slot
    className += 'bg-success bg-gradient';
  } else if (isHappySlot) {
    // this slot has enough assignments
    className += 'bg-primary bg-gradient';
  } else if (isOwnRequest) {
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

// Custom hook that returns true if this slot is important.
// If person has a request for this slot and has only a few
// other requests to other slots, this is important slot.
function useImportant(reqIds, slotRequests) {
  const { reqsByPerson } = useContext(ProjectContext);

  let personIds = [];
  for (let i = 0; i < reqIds.length; i++) {
    personIds = [...personIds, ...Object.keys(slotRequests[reqIds[i]].persons)];
  }

  // get minimum amount of slot requests by one person
  let min;
  const ids = Object.keys(reqsByPerson ?? {}).filter((personId) =>
    personIds.includes(personId),
  );
  for (let i = 0; i < ids.length; i++) {
    const reqs = reqsByPerson[ids[i]];
    if (!min || (reqs.length > 0 && reqs.length < min)) {
      min = reqs.length;
    }
  }
  return min > 0 && min <= IMPORTANT_REQUEST_THRESHOLD;
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

  // filter requests for this slot
  const reqIds = useMemo(
    () =>
      Object.keys(slotRequests).filter(
        (id) => slotRequests[id].slotId === slotId,
      ),
    [slotId, slotRequests],
  );

  const count = reqIds.length;
  const isImportant = useImportant(reqIds, slotRequests);

  return (
    <SlotContainer slot={slot} className={className} onClick={onClick}>
      <div className="text-center d-flex justify-content-center align-items-center h-100">
        {!isHappySlot && isImportant ? (
          <Badge pill bg="warning">
            {count}
          </Badge>
        ) : (
          <span>{count}</span>
        )}
      </div>
    </SlotContainer>
  );
}
