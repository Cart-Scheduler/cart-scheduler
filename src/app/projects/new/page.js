import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import slugify from 'slugify';

import { LayoutContainer } from '../../../layouts/Default';
import Breadcrumb from '../../../layouts/Breadcrumb';
import { createProject } from '../../../services/functions';

const makeId = (name) => slugify(name, { lower: true });

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={t('New project')}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item>{t('New')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

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
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb />}>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="pb-0">
              <h6>{t('Create new project')}</h6>
            </Card.Header>
            <Card.Body className="pt-2">
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <p>
                    {t(
                      'This form is for users who want to start a new project for scheduling cart shifts.',
                    )}
                  </p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="new-name">
                  <Form.Label>{t('Name')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(evt) => handleNameChange(evt.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    {t('Name for the cart project. It can be changed later.')}
                  </Form.Text>
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
                  <Form.Text className="text-muted">
                    {t(
                      'Project ID is permanent, you cannot change it later. Try to keep it simple.',
                    )}
                  </Form.Text>
                </Form.Group>
                <div>{error ? t(error) : ''}</div>
                <Button variant="primary" type="submit" disabled={creating}>
                  {t('Create project')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
