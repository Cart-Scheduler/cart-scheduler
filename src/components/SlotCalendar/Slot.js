import { FaCheck } from 'react-icons/fa';

import { getNameInitials } from '../../services/string';
import { HAPPY_SLOT_PERSON_COUNT, HOUR_ROW_HEIGHT } from './constants';

const getAssignedNames = (slot) => {
  return Object.values(slot?.persons ?? {}).map((person) =>
    getNameInitials(person.name),
  );
};

const getRequestPartners = (slotRequest, personId) => {
  return Object.keys(slotRequest?.persons ?? {})
    .filter((id) => id !== personId)
    .map((id) => getNameInitials(slotRequest.persons[id].name));
};

function BigCheck() {
  return (
    <div className="text-lg text-center d-flex justify-content-center align-items-center h-100">
      <FaCheck />
    </div>
  );
}

export default function Slot({ slot, slotRequest, personId, onClick }) {
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
    <div className={className} style={style} onClick={handleClick}>
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
    </div>
  );
}
