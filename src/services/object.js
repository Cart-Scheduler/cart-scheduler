// Filters object by calling the given callback function for each entry with
// [key, value] parameter. It should return a truthy value to keep the entry
// in the resulting object, and a falsy value otherwise.
export const filterObj = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).filter(fn));
