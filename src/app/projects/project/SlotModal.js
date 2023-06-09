import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

export default function SlotModal({ show, onHide, slot }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();
  const { t } = useTranslation();

  const create = async () => {
    setSaving(true);
    setError();
    try {
      // TODO
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setSaving(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    create();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Cart slot')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <code>{JSON.stringify(slot ?? {})}</code>
        </Modal.Body>
        <Modal.Footer>
          <div>{error ? t(error) : ''}</div>
          <Button variant="primary" type="submit" disabled={saving}>
            {t('Save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
