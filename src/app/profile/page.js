import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { LayoutContainer } from '../../layouts/Default';
import Breadcrumb from '../../layouts/Breadcrumb';
import {
  useAuth,
  useListenPerson,
  usePersonId,
  updatePersonDoc,
} from '../../services/db';

const cleanName = (name) => name.trim();

function ProfileForm() {
  const { t } = useTranslation();
  const auth = useAuth();
  const personId = usePersonId();
  const person = useListenPerson();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  useEffect(() => {
    if (person) {
      setName(person.name);
    }
  }, [person]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSaving(true);
    try {
      await updatePersonDoc(personId, { name: cleanName(name) });
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>{t('Name')}</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder={t('John Smith')}
              value={name}
              onChange={(evt) => setName(evt.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>{t('Email address')}</Form.Label>
            <Form.Control
              required
              type="text"
              value={auth?.user?.email}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            type="submit"
            className="bg-gradient-primary"
            disabled={saving}
          >
            {t('Save')}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={t('Profile')}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item>{t('Profile')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function Profile() {
  const { t } = useTranslation();
  return (
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb />}>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className="pb-0">
              <h6>{t('Profile')}</h6>
            </Card.Header>
            <Card.Body>
              <ProfileForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}