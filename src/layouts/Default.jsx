import { Outlet, Link } from 'react-router';
import NotificationController from '../components/notifications/Controller';
import CookieConsent from '../components/CookieConsent';
import Footer from './Footer';
import TimezoneChecker from '../components/TimezoneChecker';

import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Offcanvas from 'react-bootstrap/Offcanvas';
import DbError from '../components/DbError';
import { useUserDocError, usePersonDocError, usePerson } from '../services/db';

import {
  FaBars,
  FaHome,
  FaPlus,
  FaSignOutAlt,
  FaUserCircle,
} from 'react-icons/fa';

import '../assets/scss/index.scss';

function Version() {
  if (!import.meta.env.VITE_APP_VERSION) return null;

  return (
    <div className="text-xs text-muted mt-5">
      {import.meta.env.VITE_APP_VERSION}
    </div>
  );
}

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
}

function MyOffCanvas({ title }) {
  const { t } = useTranslation();
  const iconClass = 'me-2';

  return (
    <Navbar.Offcanvas placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{title}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="justify-content-end flex-grow-1 pe-3">
          <Nav.Link as={Link} to="/">
            <FaHome className={iconClass} /> {t('Home')}
          </Nav.Link>

          <Nav.Link as={Link} to="/profile">
            <FaUserCircle className={iconClass} /> {t('Profile')}
          </Nav.Link>

          <Nav.Link as={Link} to="/projects/new">
            <FaPlus className={iconClass} /> {t('New project')}
          </Nav.Link>

          <Nav.Link as={Link} to="/signout">
            <FaSignOutAlt className={iconClass} /> {t('Sign out')}
          </Nav.Link>
        </Nav>

        <Version />
      </Offcanvas.Body>
    </Navbar.Offcanvas>
  );
}

function MyNavbar({ breadcrumb }) {
  const { data: person } = usePerson();
  const title = person?.name ?? 'Menu';

  return (
    <Navbar
      expand={false}
      bg="transparent"
      variant="dark"
      className="px-0 mx-2 mx-sm-4 shadow-none navbar-transparent"
    >
      <Container fluid className="py-1 px-1 px-sm-3 flex-nowrap">
        {breadcrumb}
        <Navbar.Toggle className="align-self-start">
          <FaBars />
        </Navbar.Toggle>
        <MyOffCanvas title={title} />
      </Container>
    </Navbar>
  );
}

export function LayoutContainer({ fluid, breadcrumb, children }) {
  return (
    <>
      <MyNavbar breadcrumb={breadcrumb} />
      <Container fluid={fluid} className="py-4">
        <UserDocErrorChecker />
        <TimezoneChecker />
        {children}
        <Footer />
      </Container>
    </>
  );
}

export default function DefaultLayout() {
  return (
    <>
      <div className="min-height-300 bg-primary position-absolute w-100" />
      <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
        <NotificationController />
        <Outlet />
        <CookieConsent />
      </main>
    </>
  );
}
