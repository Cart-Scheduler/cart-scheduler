import { useEffect, useMemo, useState } from 'react';

import { filterObj } from './object';

// Returns an object where:
// key:   person id
// value: array of slot ids where person is assigned
const indexSlotsByPerson = (slots) => {
  const index = {};
  const ids = Object.keys(slots);
  const length = ids.length;
  for (let i = 0; i < length; i++) {
    const slotId = ids[i];
    if (!slots[slotId]?.persons) {
      continue;
    }
    const personIds = Object.keys(slots[slotId].persons);
    const pLen = personIds.length;
    for (let j = 0; j < pLen; j++) {
      const personId = personIds[j];
      if (index[personId] === undefined) {
        index[personId] = [];
      }
      // no duplicates
      if (!index[personId].includes(slotId)) {
        index[personId].push(slotId);
      }
    }
  }
  return index;
};

// Returns an object where:
// key:   person id
// value: array of slot ids where person is assigned
const indexDraftSlotsByPerson = (requests, slots) => {
  const index = {};
  const ids = Object.keys(requests);
  const length = ids.length;
  for (let i = 0; i < length; i++) {
    const req = requests[ids[i]];
    if (!req?.persons) {
      continue;
    }
    const slotId = req.slotId;
    const personIds = Object.keys(req.persons);
    const pLen = personIds.length;
    for (let j = 0; j < pLen; j++) {
      const personId = personIds[j];
      if (index[personId] === undefined) {
        index[personId] = [];
      }
      // no duplicates
      if (!index[personId].includes(slotId)) {
        index[personId].push(slotId);
      }
    }
  }
  return index;
};

// Returns an object where:
// key:   person id
// value: array of request ids where person is assigned
const indexRequestsByPerson = (requests, slots) => {
  const index = {};
  const ids = Object.keys(requests);
  const length = ids.length;
  for (let i = 0; i < length; i++) {
    const reqId = ids[i];
    if (!requests[reqId]?.persons) {
      continue;
    }
    const personIds = Object.keys(requests[reqId].persons);
    const pLen = personIds.length;
    for (let j = 0; j < pLen; j++) {
      const personId = personIds[j];
      if (index[personId] === undefined) {
        index[personId] = [];
      }
      // no duplicates
      if (!index[personId].includes(reqId)) {
        index[personId].push(reqId);
      }
    }
  }
  return index;
};

const slotInRange = (slot, range) =>
  range[0] &&
  range[1] &&
  slot &&
  slot.starts >= range[0] &&
  slot.ends <= range[1];

const filterSlotsByRange = (slots, range) =>
  filterObj(slots, ([id, slot]) => slotInRange(slot, range));

const filterRequestsByRange = (requests, slots, range) =>
  filterObj(requests, ([id, req]) => slotInRange(slots[req.slotId], range));

// Hook that creates an index where slots and draft slots (selected requests)
// are indexed by person id. This is used for showing a counter in how many
// slots a person currently is assigned.
export function useSlotIndexes(slots, selectedReqs, range) {
  const [slotsByPerson, setSlotsByPerson] = useState({});
  const [draftSlotsByPerson, setDraftSlotsByPerson] = useState({});

  const rangedSlots = useMemo(
    () => filterSlotsByRange(slots, range),
    [slots, range],
  );

  useEffect(() => {
    const index = indexSlotsByPerson(rangedSlots);
    setSlotsByPerson(index);
  }, [rangedSlots]);

  const rangedSelectedReqs = useMemo(
    () => filterRequestsByRange(selectedReqs, slots, range),
    [selectedReqs, slots, range],
  );

  useEffect(() => {
    const index = indexDraftSlotsByPerson(rangedSelectedReqs, slots);
    setDraftSlotsByPerson(index);
  }, [rangedSelectedReqs, slots]);

  return {
    slotsByPerson,
    draftSlotsByPerson,
  };
}

export function useRequestIndexes(requests, slots, selectedReqs, range) {
  const [reqsByPerson, setReqsByPerson] = useState({});
  const rangedReqs = useMemo(
    () => filterRequestsByRange(requests, slots, range),
    [requests, slots, range],
  );
  useEffect(() => {
    const index = indexRequestsByPerson(rangedReqs);
    setReqsByPerson(index);
  }, [rangedReqs]);
  return {
    reqsByPerson,
  };
}
