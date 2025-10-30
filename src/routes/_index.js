// src/routes/_index.js

// KORJATTU: 'react-router' korvattu 'react-router'
import { Navigate } from 'react-router';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';

import { useMyProjectMembers } from '../services/db';
// TÄRKEÄÄ: LayoutContainerin käyttö (käsitellään kohdassa 2)
// import { LayoutContainer } from '../layouts/Default';
import Breadcrumb from '../layouts/Breadcrumb';
import Welcome from '../components/Welcome';

function MyBreadcrumb() {
  const { t } = useTranslation();
  return <Breadcrumb title={t('Home')}></Breadcrumb>;
}

function WorkInProgress() {
  return (
    <div className="d-flex justify-content-center align-items-center p-4 h-100">
      <div className="text-center">
        <h3 className="mb-4">
          <FaSpinner />
        </h3>
        <h5 className="mb-4">Palvelua vielä kehitetään</h5>
        <p>
          Kiitos kun rekisteröidyit palveluun! Ole hyvä ja odota, kunnes saat
          WhatsApp-ryhmässä lisätietoa siitä, milloin pääset anomaan vuoroja.
          Kärsivällisyys palkitaan!
        </p>
      </div>
    </div>
  );
}

function Redirect() {
  const { docs, isLoading } = useMyProjectMembers();
  if (isLoading) {
    return (
      <h3 className="mb-4">
        <FaSpinner />
      </h3>
    );
  }
  const projectIds = Object.keys(docs);
  if (projectIds.length === 1) {
    // KORJATTU: Navigate käyttää myös 'react-router' -pakettia
    return <Navigate to={`/projects/${projectIds[0]}`} />;
  }
  // KORJATTU: Navigate käyttää myös 'react-router' -pakettia
  return <Navigate to="/projects" />;
}

// Tämä on Framework Moden etusivun komponentti
export default function Home() {
  return (
    // HUOM: LayoutContainer poistetaan TÄSTÄ, koska Layout hoidetaan root.jsx:ssä!
    <>
      <MyBreadcrumb /> {/* Jätä Breadcrumb tänne, jos se on reittispesifi */}
      <Welcome />
      <Row>
        <Col>
          <Card className="mb-4" style={{ minHeight: '20em' }}>
            <Card.Body>
              <Redirect />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
