import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import Spinner from '../../components/Spinner';
import { LayoutContainer } from '../../layouts/Default';
import Breadcrumb from '../../layouts/Breadcrumb';
import {
  useAuth,
  usePerson,
  usePersonId,
  updatePersonDoc,
} from '../../services/db';

const cleanName = (name) => (name ?? '').trim();

function ProfileForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const personId = usePersonId();
  const { data: person } = usePerson();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  useEffect(() => {
    if (person) {
      if (person.name !== undefined) {
        setName(person.name);
      }
      if (person.gender !== undefined) {
        setGender(person.gender);
      }
    }
  }, [person]);
  const nameEmpty = (name ?? '').trim().length === 0;

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setSaving(true);
    try {
      await updatePersonDoc(personId, {
        name: cleanName(name),
        gender,
      });
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  if (!person) {
    return <Spinner />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col sm={12} md={6}>
          <Form.Group className={`mb-3 ${nameEmpty ? 'has-danger' : ''}`}>
            <Form.Label>{t('Name')}</Form.Label>
            <Form.Control
              required
              type="text"
              name="name"
              size="lg"
              placeholder={t('John Smith')}
              autoComplete="name"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              className={`${nameEmpty ? 'is-invalid' : ''}`}
            />
            {nameEmpty && (
              <Form.Text muted>
                {t('Please enter your name so that others can recognize you.')}
              </Form.Text>
            )}
          </Form.Group>
        </Col>
        <Col sm={12} md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{t('Email address')}</Form.Label>
            <Form.Control
              required
              type="text"
              size="lg"
              value={auth?.user?.email}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Check
              required
              type="radio"
              id="gender-male"
              label={t('Male')}
              name="gender"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            <Form.Check
              type="radio"
              id="gender-female"
              label={t('Female')}
              name="gender"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
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
              <h6 className="mb-0">{t('Profile')}</h6>
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
