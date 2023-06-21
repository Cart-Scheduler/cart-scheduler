import { useTranslation } from 'react-i18next';

import Time from '../../../components/Time';
import { WEEKDAYS } from '../../../services/date';

function Assignment({ slot, project }) {
  const { t } = useTranslation();
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  const locationName = project?.locations?.[slot.locationId]?.name;
  return (
    <li>
      {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.{starts.getMonth() + 1}.{' '}
      <Time date={starts} /> – <Time date={ends} /> {locationName}
    </li>
  );
}

export default function Assignments({ personId, slots, project }) {
  const { t } = useTranslation();
  const assignments = Object.entries(slots).filter(
    ([id, doc]) => doc.persons?.[personId],
  );
  if (assignments.length === 0) {
    return null;
  }
  return (
    <div className="ps-3 mb-4">
      {t('Your assignments:')}
      <ul>
        {assignments.map(([id, doc]) => (
          <Assignment key={id} slot={doc} project={project} />
        ))}
      </ul>
    </div>
  );
}
