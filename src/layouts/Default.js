import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Row from 'react-bootstrap/Row';

import { useAuth, usePerson } from '../services/db';
import Footer from './Footer';
import NotificationController from '../components/notifications/Controller';

function UserMenu() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: person } = usePerson();
  const name = person?.name ?? user?.email;
  return (
    <NavDropdown
      id="nav-user"
      title={name}
      menuVariant="light"
      className="text-white"
      align="end"
    >
      <NavDropdown.Item as={Link} to="/profile">
        {t('Profile')}
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} to="/signout">
        {t('Sign out')}
      </NavDropdown.Item>
    </NavDropdown>
  );
}

function MyNavbar({ breadcrumb }) {
  return (
    <Navbar
      expand="sm"
      bg="transparent"
      variant="dark"
      className="text-white px-0 mx-4 shadow-none border-radius-xl navbar-transparent"
    >
      <Container fluid className="py-1 px-3">
        {breadcrumb}
        <Navbar.Toggle>Toggle</Navbar.Toggle>
        <Navbar.Collapse className="mt-sm-0 mt-2 me-md-0 me-sm-4">
          <div className="ms-md-auto pe-md-3 d-flex align-items-center" />
          <Nav className="justify-content-end">
            <UserMenu />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export function LayoutContainer({ fluid, breadcrumb, children }) {
  return (
    <>
      <MyNavbar breadcrumb={breadcrumb} />
      <Container fluid={fluid} className="py-4">
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
      </main>
    </>
  );
}
