import Button from 'react-bootstrap/Button';

import { createSlot } from '../../../../services/db';
import { filterSlotsByRange } from '../../../../services/object';

const clipboard = [];

// Returns a copy of given slot data for clipboard.
const copySlotData = (starts, slot) => ({
  direct: slot.direct,
  // save start timestamp as offset
  startsOffset: slot.starts - starts.getTime(),
  duration: slot.ends - slot.starts,
});

export function CopySlotsButton({ starts, ends, slots }) {
  const handleClick = () => {
    clipboard.splice(0, clipboard.length);
    const rangedSlots = filterSlotsByRange(slots, starts, ends);
    Object.values(rangedSlots).forEach((slot) => {
      clipboard.push(copySlotData(starts, slot));
    });
    console.debug(`${clipboard.length} slots copied to clipboard.`);
  };
  return <Button onClick={handleClick}>Copy week</Button>;
}

// Returns true if starts-ends range does not contain any slots.
const isFree = (starts, ends, slots) => {
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (
      (slot.starts >= starts && slot.starts < ends) ||
      (slot.ends > starts && slot.ends <= ends)
    ) {
      console.debug('Paste: there is no free space for slot', starts, ends);
      return false;
    }
  }
  return true;
};

export function PasteSlotsButton({ projectId, locationId, slots, starts }) {
  const handleClick = async () => {
    const allSlots = Object.values(slots);
    const promises = [];
    for (let i = 0; i < clipboard.length; i++) {
      const src = clipboard[i];
      const slotStart = starts.getTime() + src.startsOffset;
      const ends = slotStart + src.duration;
      // make sure no other slots are overlapping
      const data = {
        projectId,
        locationId,
        starts: new Date(slotStart),
        ends: new Date(ends),
      };
      if (src.direct) {
        data.direct = true;
      }
      if (isFree(slotStart, ends, allSlots)) {
        promises.push(createSlot(data));
      }
    }
    try {
      await Promise.all(promises);
    } catch (err) {
      console.error(err);
    }
  };
  return <Button onClick={handleClick}>Paste week</Button>;
}
