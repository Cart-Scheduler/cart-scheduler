export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAYS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];

// Returns a new Date object with time 00:00:00 in current timezone that is
// days away from given date.
export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

// Returns a new Date object with time 00:00:00 in current timezone that is
// days away from given date.
export function addMinutes(date, minutes) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  next.setSeconds(0, 0);
  return next;
}

// Returns string in format "HH:MM".
export function formatTime(hours, minutes) {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Returns a new Date object that is previous Monday with time 00:00:00 in
// current timezone. If given date is already Monday, then same date is used.
// If given date is undefined, current date is used.
export function getPrevMonday(date) {
  const d = date ? date : new Date();
  const dayOfWeek = d.getDay();
  const subtract = (dayOfWeek + 6) % 7;
  const prevMonday = new Date(d);
  prevMonday.setDate(d.getDate() - subtract);
  prevMonday.setHours(0, 0, 0, 0);
  return prevMonday;
}

// Returns time distance of two slots.
// If slots are consecutive, returns 0.
// If slots are overlapping, returns -1.
export function calcSlotDistance(a, b) {
  // check if slots are overlapping
  if (
    (a.starts >= b.starts && a.starts < b.ends) ||
    (a.ends > b.starts && a.ends <= b.ends)
  ) {
    return -1;
  }
  // check if slots are consecutive
  if (a.starts === b.ends || a.ends === b.starts) {
    return 0;
  }
  // calc time distance
  if (a.ends < b.starts) {
    return b.starts - a.ends;
  } else if (b.ends < a.starts) {
    return a.starts - b.ends;
  }
  // slots overlap
  return -1;
}

// Returns a new Date object that has same date as given
// object but time is set from given string that must be
// in format "HH:MM".
export function setTimeFromStr(date, timeStr) {
  const d = new Date(date);
  const hours = parseInt(timeStr.substr(0, 2));
  const mins = parseInt(timeStr.substr(3));
  d.setHours(hours);
  d.setMinutes(mins);
  d.setSeconds(0, 0);
  return d;
}
