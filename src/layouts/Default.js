import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

export default function DefaultLayout() {
  return (
    <div className="wrapper">
      <div className="content-page">
        <div className="content">
          <Container fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
}
