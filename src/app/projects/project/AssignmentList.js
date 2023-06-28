import { useTranslation } from 'react-i18next';

import { useMySlots, useProject } from '../../../services/db';
import { filterObj } from '../../../services/object';
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

export default function Assignments({ personId, projectId }) {
  const { t } = useTranslation();
  const { data: project } = useProject(projectId);
  const { docs: allAssignments } = useMySlots(personId);

  const currentTimestamp = new Date(); // current time

  let assignments = Object.entries(
    filterObj(
      allAssignments,
      ([id, doc]) =>
        doc.projectId === projectId && new Date(doc.ends) >= currentTimestamp,
    ),
  );

  // sort by date
  assignments = assignments.sort(
    (a, b) => new Date(a[1].starts) - new Date(b[1].starts),
  );

  if (!project || assignments.length === 0) {
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
