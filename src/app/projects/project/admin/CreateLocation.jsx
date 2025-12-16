import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { updateProject } from '../../../../services/db';
import { genRandomString } from '../../../../services/string';

const getNextOrder = (project) => {
  let max = -1;
  Object.values(project?.locations ?? {}).forEach((loc) => {
    if (loc.order > max) {
      max = loc.order;
    }
  });
  return max + 1;
};

export default function CreateLocation({ projectId, project, onCreated }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const reset = () => {
    setName('');
  };
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setCreating(true);
    try {
      const newId = genRandomString(6);
      await updateProject(projectId, {
        [`locations.${newId}`]: {
          name,
          order: getNextOrder(project),
        },
      });
      onCreated(newId);
      reset();
    } catch (err) {
      console.error(err);
    }
    setCreating(false);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>{t('Cart location')}</Form.Label>
            <Form.Control
              required
              type="text"
              name="name"
              size="lg"
              placeholder={t('Market place')}
              value={name}
              onChange={(evt) => setName(evt.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            type="submit"
            className="bg-gradient-primary"
            disabled={creating}
          >
            {t('Add cart location')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
