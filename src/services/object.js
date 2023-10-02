const filterObjLegacy = (obj, fn) => {
  const result = {};
  const keys = Object.keys(obj ?? {}).filter((key) => fn([key, obj[key]]));
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = obj[keys[i]];
  }
  return result;
};

// Filters object by calling the given callback function for each entry with
// [key, value] parameter. It should return a truthy value to keep the entry
// in the resulting object, and a falsy value otherwise.
export const filterObj = (obj, fn) => {
  if (Object.fromEntries) {
    return Object.fromEntries(Object.entries(obj ?? {}).filter(fn));
  }
  return filterObjLegacy(obj, fn);
};

// Filters objects by date range.
export const filterSlotsByRange = (slots, starts, ends) =>
  filterObj(
    slots,
    ([id, slot]) =>
      slot.starts >= starts.getTime() && slot.ends < ends.getTime(),
  );
