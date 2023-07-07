import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';

import { deleteSlotPerson } from '../../../../../services/db';

function Assignment({ slotId, personId, person }) {
  const removePerson = async () => {
    try {
      await deleteSlotPerson(slotId, personId);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <li className="list-group-item border-0 d-flex align-items-center">
      {person?.name}
      <Button onClick={removePerson}>Remove</Button>
    </li>
  );
}

export default function AssignmentList({ slotId, slot }) {
  const { t } = useTranslation();
  const assignments = Object.entries(slot?.persons ?? {});
  return (
    <div className="mb-3">
      <h6 className="text-uppercase text-body text-xs font-weight-bolder mb-3">
        {t('Accepted')} ({Object.keys(assignments).length})
      </h6>
      <ul className="list-group">
        {assignments.map(([personId, person]) => (
          <Assignment
            key={personId}
            slotId={slotId}
            personId={personId}
            person={person}
          />
        ))}
      </ul>
    </div>
  );
}
