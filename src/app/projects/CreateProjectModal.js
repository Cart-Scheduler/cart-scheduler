import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import slugify from 'slugify';

import { createProject } from '../../services/functions';

const makeId = (name) => slugify(name, { lower: true });

export default function CreateProjectModal({ show, onHide }) {
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState();
  const { t } = useTranslation();

  const create = async () => {
    setCreating(true);
    try {
      await createProject({ id: projectId, name });
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setCreating(false);
  };

  const handleNameChange = (value) => {
    setName(value);
    setProjectId(makeId(value));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    create();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Create new project')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="new-name">
            <Form.Label>{t('Name')}</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(evt) => handleNameChange(evt.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="new-id">
            <Form.Label>{t('Project ID')}</Form.Label>
            <Form.Control
              type="text"
              value={projectId}
              onChange={(evt) => setProjectId(evt.target.value)}
              size="sm"
              disabled
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <div>{error ? t(error) : ''}</div>
          <Button variant="primary" type="submit" disabled={creating}>
            {t('Create')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
