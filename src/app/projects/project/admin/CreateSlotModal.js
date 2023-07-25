import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { addMinutes } from '../../../../services/date';
import { createSlot } from '../../../../services/db';

const DEFAULT_DURATION = 60;

export default function CreateSlotModal({
  show,
  onHide,
  projectId,
  locationId,
  starts,
}) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState();
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [direct, setDirect] = useState(false);
  const { t } = useTranslation();

  const create = async () => {
    setCreating(true);
    setError();
    try {
      const ends = addMinutes(starts, parseInt(duration));
      const data = { projectId, locationId, starts, ends };
      if (direct) {
        data.direct = true;
      }
      await createSlot(data);
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setCreating(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    create();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Add slot')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="new-name">
            <Form.Label>{t('Duration (min)')}</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(evt) => setDuration(evt.target.value)}
              required
            />
          </Form.Group>
          <Form.Check
            type="switch"
            id="direct-switch"
            label={t('Direct reservation')}
            checked={direct}
            onChange={() => setDirect((val) => !val)}
          />
          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={creating}>
            {t('Add slot')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
