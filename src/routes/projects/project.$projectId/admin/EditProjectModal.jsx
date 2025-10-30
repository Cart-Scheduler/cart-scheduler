import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { updateProject } from '../../../../services/db';

export default function EditProjectModal({ show, onHide, projectId, project }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();
  const [name, setName] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    const newName = project?.name;
    setName(newName || '');
  }, [project]);

  const edit = async () => {
    setSaving(true);
    setError();
    try {
      await updateProject(projectId, {
        name,
      });
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setSaving(false);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    edit();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Modify project')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="new-name">
            <Form.Label>{t('Name')}</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={saving}>
            {t('Save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
