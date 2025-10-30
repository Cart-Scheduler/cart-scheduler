export function getNameInitials(name) {
  const parts = (name ?? '').trim().split(' ');
  let initials = '';
  for (let i = 0; i < parts.length && i < 2; i++) {
    initials += parts[i][0];
  }
  return initials.toUpperCase();
}

export function createMembersArray(members, personId) {
  let membersArray = Object.entries(members ?? {})
    .filter(([id]) => id !== personId)
    .map(([id, member]) => ({
      value: id,
      label: member.name,
    }));
  membersArray.sort((a, b) => nameSorter(a.label, b.label));
  return membersArray;
}

const CHARACTERS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Returns a string that contains random characters and has given length.
export function genRandomString(len) {
  let str = '';
  for (let i = 0; i < len; i++) {
    const index = Math.floor(Math.random() * CHARACTERS.length);
    str += CHARACTERS[index];
  }
  return str;
}

export function nameSorter(a, b) {
  let [aLastName, aFirstName] = a.toLowerCase().split(' ').reverse();
  let [bLastName, bFirstName] = b.toLowerCase().split(' ').reverse();

  aLastName = aLastName || aFirstName;
  bLastName = bLastName || bFirstName;

  // sort by last name
  if (aLastName < bLastName) return -1;
  if (aLastName > bLastName) return 1;

  if (aFirstName < bFirstName) return -1;
  if (aFirstName > bFirstName) return 1;

  return 0;
}
