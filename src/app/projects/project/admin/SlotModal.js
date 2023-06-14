import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { WEEKDAYS } from '../../../../services/date';
import { deleteSlot } from '../../../../services/db';
import Time from '../../../../components/Time';

function Title({ slot }) {
  const { t } = useTranslation();
  if (!slot) {
    return null;
  }
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  return (
    <Modal.Title>
      {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.{starts.getMonth() + 1}.{' '}
      <Time date={starts} /> – <Time date={ends} />
    </Modal.Title>
  );
}

export default function SlotModal({
  show,
  onHide,
  projectId,
  slotId,
  slotRequestId,
  slotRequest,
  slot,
  members,
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();
  const { t } = useTranslation();

  const create = async () => {
    setProcessing(true);
    setError();
    try {
      // TODO
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    create();
  };

  const handleDelete = async () => {
    setProcessing(true);
    setError();
    try {
      await deleteSlot(slotId);
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  // clear errors when showing modal
  useEffect(() => {
    if (show) {
      setError();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Title slot={slot} />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {slotRequestId ? (
            <p>
              {t(
                'You have already sent a request for this cart shift. If you want to update the request, make the changes and press Update. You can cancel your request by pressing Remove request.',
              )}
            </p>
          ) : (
            <p>
              {t(
                'If you are available for this cart shift, fill the form and press Send request. Sending a request does not mean that your request is accepted. You will be informed about accepted requests.',
              )}
            </p>
          )}
          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        <Modal.Footer
          className={slotRequestId ? 'justify-content-between' : ''}
        >
          <Button variant="danger" disabled={processing} onClick={handleDelete}>
            {t('Delete')}
          </Button>
          <Button variant="primary" type="submit" disabled={processing}>
            {t('Save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
