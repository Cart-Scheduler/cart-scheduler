import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

import { useAuth, usePerson } from '../services/db';

function UserMenu() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: person } = usePerson();
  const name = person?.name ?? user?.email;
  return (
    <Dropdown>
      <Dropdown.Toggle>{name}</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/signout">
          {t('Sign out')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function MyNavbar() {
  return (
    <Navbar
      expand="lg"
      className="top-0 z-index-3 w-100 shadow-none my-3 navbar-transparent"
    >
      <Container>
        <Navbar.Toggle>Toggle</Navbar.Toggle>
        <Navbar.Collapse>
          <Nav>
            <Row>
              <Col>
                <UserMenu />
              </Col>
            </Row>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default function DefaultLayout() {
  return (
    <div className="main-content position-relative max-height-vh-100 h-100">
      <MyNavbar />
      <Outlet />
    </div>
  );
}
