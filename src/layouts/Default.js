import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

function MyNavbar() {
  const { t } = useTranslation();
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
                <Link to="/signout">
                  <i className="fa fa-user me-sm-2" />
                  <span className="d-sm-inline d-none">{t('Sign out')}</span>
                </Link>
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
