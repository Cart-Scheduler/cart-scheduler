import { createSlot } from './db';
import { filterObj } from './object';

const clipboard = [];

// Filters objects by date range.
export const filterSlotsByRange = (slots, starts, ends) =>
  filterObj(
    slots,
    ([id, slot]) =>
      slot.starts >= starts.getTime() && slot.ends < ends.getTime(),
  );

// Returns a copy of given slot data for clipboard.
const copySlotData = (starts, slot) => ({
  direct: slot.direct,
  // save start timestamp as offset
  startsOffset: slot.starts - starts.getTime(),
  duration: slot.ends - slot.starts,
});

// Copies slot information to the internal clipboard.
export async function copySlots(slots, starts, ends) {
  clipboard.splice(0, clipboard.length);
  const rangedSlots = filterSlotsByRange(slots, starts, ends);
  Object.values(rangedSlots).forEach((slot) => {
    clipboard.push(copySlotData(starts, slot));
  });
  console.debug(`${clipboard.length} slots copied to clipboard.`);
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

// Creates new slots with data from the internal clipboard.
export async function pasteSlots(projectId, locationId, slots, starts) {
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
}
