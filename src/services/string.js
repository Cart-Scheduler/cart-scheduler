export function getNameInitials(name) {
  const parts = (name ?? '').split(' ');
  let initials = '';
  for (let i = 0; i < parts.length && i < 2; i++) {
    initials += parts[i][0];
  }
  return initials.toUpperCase();
}
