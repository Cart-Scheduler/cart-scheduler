import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { logSignInError } from '../../services/analytics';
import { signInPassword } from '../../services/auth';

export const cleanEmail = (email) => email.trim().toLowerCase();

export default function PasswordSignIn({ next, onCancel }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const send = async () => {
    try {
      setError();
      setProcessing(true);
      const cleaned = cleanEmail(email);
      await signInPassword(cleaned, password);
      setEmail(cleaned);
    } catch (err) {
      console.error(err);
      setError(err.message);
      logSignInError(err.code);
    }
    setProcessing(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    send();
  };

  return (
    <div>
      <div className="mt-3">
        <p className="text-center mb-4 text-md mx-auto">
          {t(
            'Dear user, we are strongly recommending you to use passwordless logins.',
          )}
        </p>
      </div>
      <div className="mb-4" style={{ borderTop: '1px solid lightgrey' }}></div>
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
            autoComplete="current-password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </Form.Group>
        {error && (
          <Alert variant="danger" className="text-white">
            {t(error)}
          </Alert>
        )}
        <div className="justify-content-center mt-5 mb-4 d-flex justify-end">
          <Button
            variant="outline"
            disabled={processing}
            onClick={onCancel}
            className="mx-3 w"
          >
            {t('Cancel')}
          </Button>
          <Button
            type="submit"
            className="bg-gradient-primary"
            disabled={processing}
          >
            {t('Sign in')}
          </Button>
        </div>
        <div className="">
          <p className="text-center mb-4 mt-3 text-sm mx-auto">
            {t("Don't have an account?")}{' '}
            <Link
              to="/signup/password"
              className="text-primary font-weight-bold"
            >
              {t('Sign up')}
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
