import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { saveSignInEmail, signInLinkToEmail } from '../../services/auth';
import BackButton from './BackButton';

export const cleanEmail = (email) => email.trim().toLowerCase();

export default function PasswordSignIn({ next, onCancel }) {
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();

  const send = async () => {
    try {
      setSending(true);
      const cleaned = cleanEmail(email);
      await signInLinkToEmail(cleaned, next);
      // save the used email locally so we don't need to ask the user for it
      // again if they open the link on this same device
      saveSignInEmail(cleaned);
      setSending(false);
      setEmail(cleaned);
      setIsSent(true);
    } catch (err) {
      // if you get auth/invalid-continue-uri here, make sure you have
      // REACT_APP_EMAIL_LINK_AUTH_URL defined in .local.env
      console.error(err);
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    send();
  };

  if (isSent) {
    return null;
    //return <EmailSent email={email} />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>{t('Email address')}</Form.Label>
        <Form.Control
          required
          type="email"
          placeholder={t('john.smith@example.com')}
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {t(
            'Please check that your email address is typed correctly. For example, it must not contain spaces.',
          )}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-5">
        <Form.Label>{t('Password')}</Form.Label>
        <Form.Control
          required
          type="password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
      </Form.Group>
      <div className="d-flex justify-end">
        <Button
          variant="outline"
          disabled={sending}
          onClick={onCancel}
          className="mx-3 w"
        >
          {t('Cancel')}
        </Button>
        <Button
          type="submit"
          className="bg-gradient-primary"
          disabled={sending}
        >
          {t('Sign in')}
        </Button>
      </div>
      <div className="">
        <p className="mb-4 text-sm mx-auto">
          {t("Don't have an account?")}{' '}
          <Link to="/signup/password" className="text-primary font-weight-bold">
            {t('Sign up')}
          </Link>
        </p>
      </div>
    </Form>
  );
}
