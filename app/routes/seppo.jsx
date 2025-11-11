//import { Navigate } from 'react-router';
import Card from 'react-bootstrap/Card';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';

//import { useMyProjectMembers } from '../services/db';

import Breadcrumb from '../layouts/Breadcrumb';
import Welcome from '../components/Welcome';

export function meta() {
  return [
    { title: 'Testisovellus - Etusivu' },
    { name: 'description", content: "Etusivu' },
  ];
}

function MyBreadcrumb() {
  const { t } = useTranslation();
  return <Breadcrumb title={t('Home')}></Breadcrumb>;
}
/*
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
    return <Navigate to={`/projects/${projectIds[0]}`} />;
  }
  return <Navigate to="/projects" />;
}*/

export default function Home() {
  return (
    <>
      <div>Moi</div>
      <Welcome />
      <Row>
        <Col>
          <Card className="mb-4" style={{ minHeight: '20em' }}>
            <Card.Body>
              <h1>TestiTeppoSeppo</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
  /*
  return (
    <>
      <>
        <div></div>
        <div>
          <Container>Topi</Container>
        </div>
      </>
      <MyBreadcrumb />
      <Welcome />
      <Row>
        <Col>
          <Card className="mb-4" style={{ minHeight: '20em' }}>
            <Card.Body>
              <h1>TestiTeppoSeppo</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
  */
}
