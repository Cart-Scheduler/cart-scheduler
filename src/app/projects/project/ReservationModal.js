import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import AssignmentEditor from './AssignmentEditor';
import Time from '../../../components/Time';
import { WEEKDAYS } from '../../../services/date';

function Title({ locationName, slot }) {
  const { t } = useTranslation();
  if (!slot) {
    return null;
  }
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  return (
    <Modal.Title>
      {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.{starts.getMonth() + 1}.{' '}
      <Time date={starts} /> – <Time date={ends} /> {locationName}
    </Modal.Title>
  );
}

export default function ReservationModal({
  show,
  onHide,
  projectId,
  slotId,
  slot,
  locationName,
  members,
}) {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Title locationName={locationName} slot={slot} />
      </Modal.Header>
      <Modal.Body>
        <AssignmentEditor
          slotId={slotId}
          slot={slot}
          members={members}
          onComplete={onHide}
        />
      </Modal.Body>
    </Modal>
  );
}
