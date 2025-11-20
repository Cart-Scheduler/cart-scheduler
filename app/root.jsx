import {
  Link,
  Outlet,
  Meta,
  Links,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import { Provider } from 'react-redux';
import store from './redux/store';

import { InitApp } from './services/init';

import './assets/scss/index.scss';
import MainListener from './components/MainListener';

/*
initLocales();
initFirebase();

initAuth();
initDb();
initFunctions();
initMessaging();
*/

/*
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap'; //Navbar from 'react-bootstrap/Navbar';
import { Offcanvas } from 'react-bootstrap';
import {
  FaBars,
  FaHome,
  FaPlus,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';
import {
  useAuth,
  usePerson,
  usePersonDocError,
  useUserDocError,
} from './services/db.js';
import DbError from './components/DbError.jsx';
import Footer from './layouts/Footer.jsx';

import NotificationController from './components/notifications/Controller.jsx';
import TimezoneChecker from './components/TimezoneChecker.jsx';
import CookieConsent from './components/CookieConsent.jsx';*/
/*


function UserDocErrorChecker() {
  const { error: userError, uid } = useUserDocError();
  const { error: personError, personId } = usePersonDocError();
  if (userError) {
    return (
      <DbError
        error={{
          message: userError.message,
          code: `${userError.code} - uid ${uid}`,
        }}
      />
    );
  }
  if (personError) {
    return (
      <DbError
        error={{
          message: personError.message,
          code: `${personError.code} - person ${personId}`,
        }}
      />
    );
  }
  return null;
}*/

export function Layout({ children }) {
  //const { t } = useTranslation();
  const t = () => {};
  const emptyBreadcrumb = (
    <h6 className="mb-0 text-white">{t('Select project')}</h6>
  );

  return (
    <html lang="fi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-height-300 bg-primary position-absolute w-100" />
        <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
          <InitApp>
            <Provider store={store}>
              <MainListener>
                <Container fluid className="py-4">
                  {children}
                </Container>
              </MainListener>
            </Provider>
          </InitApp>
        </main>
        <Scripts />
      </body>
    </html>
  );
}
export default function App() {
  return <Outlet />;
}
/*
export function Layout({ children }) {
  const { t } = useTranslation();
  const emptyBreadcrumb = (
    <h6 className="mb-0 text-white">{t('Select project')}</h6>
  );

  return (
    <html lang="fi">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-height-300 bg-primary position-absolute w-100" />
        <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
          <NotificationController />
          <MyNavbar breadcrumb={emptyBreadcrumb} />
          <Container fluid className="py-4">
            <UserDocErrorChecker />
            <TimezoneChecker />
            <Outlet />
            <Footer />
          </Container>
          <CookieConsent />
        </main>
        <Scripts />
      </body>
    </html>
  );
}
*/
/*
export default function App() {
  return <Outlet />;
}

export function Layout({ children }) {
  return (
    <html lang="fi">
      <head></head>
      <body>
        Topi2
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}*/

export function ErrorBoundary({ error }) {
  return <div>VIRHE VIRHE</div>;
}
