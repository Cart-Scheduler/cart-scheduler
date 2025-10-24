import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';


import { cleanupProjectData } from '../../../../services/db';

export default function CleanupModal({ show, onHide, projectId }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();
  const [cleanupDone, setCleanupDone] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const { t } = useTranslation();

  const cleanup = async () => {
    setSaving(true);
    setError();
    setCleanupDone(false);

    try {

      const count = await cleanupProjectData(projectId);

      setDeletedCount(count);
      setCleanupDone(true);
      setTimeout(() => {
        onHide();
      }, 1000);

    } catch (err) {
      console.error('Cleanup failed:', err);
      setError(err.message || 'Cleanup failed due to an unknown error.');
      setSaving(false);
    }

  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    cleanup();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Cleanup')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p>{t('Hehe')}</p>
          {error && <Alert >{t(error)}</Alert>}
          {cleanupDone && !error &&
            <Alert variant="success">
              {t('Cleanup successful! Deleted: {{count}} documents.', { count: deletedCount })}
            </Alert>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" type="submit" disabled={saving}>
            {saving ? t('Running Cleanup...') : t('Hihi')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
