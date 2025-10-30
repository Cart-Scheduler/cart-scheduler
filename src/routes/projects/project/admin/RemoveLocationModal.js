import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { deleteProjectLocations } from '../../../../services/db';

export default function RemoveLocationModal({
  show,
  onHide,
  projectId,
  project,
  locationId,
  onDeleted,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const newName = project?.locations?.[locationId]?.name;
    if (newName) {
      setName(newName);
    }
  }, [project, locationId]);

  const handleDelete = async () => {
    setDeleting(true);
    setError();
    try {
      await deleteProjectLocations(projectId, [locationId]);
      onDeleted();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setDeleting(false);
  };

  const txt = t('Do you really want to remove cart location $NAME?').replaceAll(
    '$NAME',
    name,
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Are you sure?')}</Modal.Title>
        {error && <Alert variant="danger">{t(error)}</Alert>}
      </Modal.Header>
      <Modal.Body>{txt}</Modal.Body>
      <Modal.Footer>
        <Button variant="light" disabled={deleting} onClick={onHide}>
          {t('Cancel')}
        </Button>
        <Button variant="danger" disabled={deleting} onClick={handleDelete}>
          {t('Remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
