import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
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
} from '../services/db';
import DbError from '../components/DbError';
import Footer from './Footer';
import NotificationController from '../components/notifications/Controller';
import TimezoneChecker from '../components/TimezoneChecker';
import CookieConsent from '../components/CookieConsent';

function Version() {
  if (!process.env.REACT_APP_VERSION) {
    return null;
  }
  return (
    <div className="text-xs text-muted mt-5">
      {process.env.REACT_APP_VERSION}
    </div>
  );
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
  const { user } = useAuth();
  const { data: person } = usePerson();
  const title = person?.name ?? user?.email;
  return (
    <Navbar
      expand={false}
      bg="transparent"
      variant="dark"
      className="px-0 mx-4 shadow-none border-radius-xl navbar-transparent"
    >
      <Container fluid className="py-1 px-3">
        {breadcrumb}
        <Navbar.Toggle>
          <FaBars />
        </Navbar.Toggle>
        <MyOffCanvas title={title} />
      </Container>
    </Navbar>
  );
}

// Displays errors related to fetching user or person document.
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
      {/* background */}
      <div className="min-height-300 bg-primary position-absolute w-100" />
      <main className="main-content position-relative border-radius-lg max-height-vh-100 h-100">
        <NotificationController />
        <Outlet />
        <CookieConsent />
      </main>
    </>
  );
}
