import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import Spinner from '../../components/Spinner';
import { DEFAULT_PATH } from '../../routes';
import {
  QUERY_PARAM_NEXT,
  isValidSignInLink,
  readSavedSignInEmail,
  useSignInWithEmailLink,
} from '../../services/auth';
import BackButton from './BackButton';
import { cleanEmail } from './SendLink';

// This page handles the link that was emailed to the user.
// The link contains data for authentication.

function InvalidLink() {
  const { t } = useTranslation();
  return (
    <div>
      <h4>{t('This link is invalid!')}</h4>
      <p>{t('SIGNIN.LINK.HELP')}</p>
      <div className="text-center">
        <BackButton />
      </div>
    </div>
  );
}

function EmailForm({ onFinish }) {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    onFinish(cleanEmail(email));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {t('Confirm authentication by entering your email address.')}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>{t('Email address')}</Form.Label>
        <Form.Control
          required
          type="email"
          placeholder={t('john.smith@example.com')}
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100">
        {t('Sign in')}
      </Button>
    </Form>
  );
}

function Error({ error }) {
  const { t } = useTranslation();
  return (
    <div>
      <Alert variant="danger" className="text-white">
        <strong>{t('Error code')}:</strong> {error.code}
      </Alert>
      <div className="text-center">
        <BackButton />
      </div>
    </div>
  );
}

export default function LinkReceiver() {
  const location = useLocation();
  // check if we have next path after a successful authentication
  const next = new URLSearchParams(location.search).get(QUERY_PARAM_NEXT);

  const link = window.location.href;

  // Read saved email. This should be available if the user completes
  // the flow on the same device where they started it.
  const [email, setEmail] = useState(readSavedSignInEmail());

  const [result, error] = useSignInWithEmailLink(email, link);

  if (!isValidSignInLink(link)) {
    return <InvalidLink />;
  }

  if (!email) {
    // User opened the link on a different device. To prevent session
    // fixation attacks, ask the user to provide the associated email again.
    return <EmailForm onFinish={(value) => setEmail(value)} />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!result) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  // user has been authenticated
  return <Navigate to={next ? next : DEFAULT_PATH} />;
}
