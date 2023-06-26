import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { signUpPassword } from '../../../services/auth';

export const cleanEmail = (email) => email.trim().toLowerCase();

export default function SignUpPassword({ next, onCancel }) {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const { t } = useTranslation();

  const send = async () => {
    try {
      setError();
      setProcessing(true);
      const cleaned = cleanEmail(email);
      await signUpPassword(cleaned, password);
      setEmail(cleaned);
      navigate(next ?? '/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (password !== password2) {
      setError(t('Passwords do not match. Please type passwords again.'));
    } else {
      send();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>{t('Email address')}</Form.Label>
        <Form.Control
          required
          type="email"
          name="email"
          size="lg"
          placeholder={t('john.smith@example.com')}
          autoComplete="email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {t(
            'Please check that your email address is typed correctly. For example, it must not contain spaces.',
          )}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('Password')}</Form.Label>
        <Form.Control
          required
          type="password"
          name="password"
          size="lg"
          placeholder={t('Password')}
          autoComplete="new-password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>{t('Password again')}</Form.Label>
        <Form.Control
          required
          type="password"
          name="password-confirm"
          size="lg"
          placeholder={t('Password')}
          autoComplete="new-password"
          value={password2}
          onChange={(evt) => setPassword2(evt.target.value)}
        />
      </Form.Group>
      {error && (
        <Alert variant="danger" className="text-white">
          {t(error)}
        </Alert>
      )}
      <div className="">
        <Button
          type="submit"
          className="bg-gradient-primary w-100"
          disabled={processing}
        >
          {t('Sign up')}
        </Button>
      </div>
    </Form>
  );
}
