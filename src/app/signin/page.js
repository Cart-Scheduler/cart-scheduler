import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Alert from 'react-bootstrap/Alert';

import Spinner from '../../components/Spinner';
import { DEFAULT_PATH } from '../../routes';
import { useCheckRedirectResult } from '../../services/auth';
import { useAuth } from '../../services/db';
import AppleSignIn from './AppleSignIn';
import GoogleSignIn from './GoogleSignIn';
import PasswordSignIn from './PasswordSignIn';
import SendLink from './SendLink';

function MethodButton({ className, onClick, children }) {
  let classes = 'btn w-100 px-3 py-3';
  if (!className || !className.includes('text-')) {
    classes += ' text-white';
  }
  return (
    <button className={classNames(classes, className)} onClick={onClick}>
      {children}
    </button>
  );
}

function SignInLinkButton({ className, onClick }) {
  const { t } = useTranslation();
  return (
    <MethodButton
      className={classNames('bg-warning', className)}
      onClick={onClick}
    >
      {t('Sign in with email link')}
    </MethodButton>
  );
}

function SignInPasswordButton({ className, onClick }) {
  const { t } = useTranslation();
  return (
    <MethodButton
      className={classNames('btn-link text-dark', className)}
      onClick={onClick}
    >
      {t('Sign in with password')}
    </MethodButton>
  );
}

export default function Login() {
  const [method, setMethod] = useState();
  const location = useLocation();
  const { t } = useTranslation();

  useCheckRedirectResult();

  // check if we have next path after a successful authentication
  const next = new URLSearchParams(location.search).get('next');

  const { error, initializing, user } = useAuth();
  if (initializing) {
    return (
      <div className="text-center pt-2 pb-2">
        <Spinner />
      </div>
    );
  }

  if (user) {
    // user is already logged in
    return <Navigate to={next ? next : DEFAULT_PATH} />;
  }

  if (method === 'link') {
    return <SendLink next={next} onCancel={() => setMethod()} />;
  }

  if (method === 'password') {
    return <PasswordSignIn next={next} onCancel={() => setMethod()} />;
  }

  // render main menu
  return (
    <div>
      {error && (
        <Alert variant="danger" className="text-white">
          {t(error.message)}
        </Alert>
      )}
      <GoogleSignIn className="w-100 mb-3" />
      <AppleSignIn className="mb-3" />
      <SignInLinkButton className="mb-3" onClick={() => setMethod('link')} />
      <SignInPasswordButton
        className="mb-3"
        onClick={() => setMethod('password')}
      />
    </div>
  );
}
