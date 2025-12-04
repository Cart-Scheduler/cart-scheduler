import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Alert } from 'react-bootstrap';

import Spinner from '../../components/Spinner';
import { DEFAULT_PATH } from '../../routes';
import { useCheckRedirectResult } from '../../services/auth';
import { useAuth } from '../../services/db';
import AppleSignIn from './AppleSignIn';
import GoogleSignIn from './GoogleSignIn';
import PasswordSignIn from './PasswordSignIn';
import SendLink from './SendLink';
import { Link } from 'react-router';

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
  const navigate = useNavigate();

  useCheckRedirectResult();

  const storedRedirect = localStorage.getItem('redirectAfterLogin');

  const urlNext = new URLSearchParams(location.search).get('next');

  const redirectPath = storedRedirect || urlNext || DEFAULT_PATH;

  const { error, initializing, user } = useAuth();

  useEffect(() => {
    if (user) {
      localStorage.removeItem('redirectAfterLogin');

      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  if (initializing) {
    return (
      <div className="text-center pt-2 pb-2">
        <Spinner />
      </div>
    );
  }

  if (user) {
    return null;
  }

  if (method === 'link') {
    return <SendLink next={urlNext} onCancel={() => setMethod()} />;
  }

  if (method === 'password') {
    return <PasswordSignIn next={urlNext} onCancel={() => setMethod()} />;
  }
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
      <TermsOfUse />
    </div>
  );
}

export function TermsOfUse() {
  const { t } = useTranslation();
  return (
    <div className="small justify-content-center align-items-center text-center pt-3 mb-4">
      {t('By signing in, You accept the ')}{' '}
      <Link to="/terms-of-use">{t('Terms of Use')}</Link>.
    </div>
  );
}
