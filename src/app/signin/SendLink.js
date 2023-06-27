import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { saveSignInEmail, signInLinkToEmail } from '../../services/auth';
import BackButton from './BackButton';

export const cleanEmail = (email) => email.trim().toLowerCase();

function EmailSent({ email }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="mb-1 text-center">
        {t('You will receive an email to address:')}
      </p>
      <h4 className="mb-4 text-center">{email}</h4>
      <p>
        {t(
          'The email contains a link that allows you to sign in without a password.',
        )}
      </p>
      <p>{t("If you don't receive the email in 15 minutes:")}</p>
      <ul className="mb-4">
        <li>{t('check that the email address above is correct')}</li>
        <li>{t('check spam')}</li>
        <li>{t('contact support')}</li>
      </ul>
      <p>{t('Please note that the link is one-time use.')}</p>
      <BackButton />
    </div>
  );
}

export default function SendLink({ next, onCancel }) {
  const [sending, setSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');
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
    return <EmailSent email={email} />;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-4">
        <Form.Label>{t('Email address')}</Form.Label>
        <Form.Control
          required
          type="email"
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
      <div className="float-end">
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
          {t('Send link')}
        </Button>
      </div>
    </Form>
  );
}
