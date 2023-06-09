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

// Return a new Date object that is previous Monday with time 00:00:00 in
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
