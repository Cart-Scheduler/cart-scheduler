import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';

import { LayoutContainer } from '../layouts/Default';
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
          Kiitos kun rekisteröidyt palveluun! Ole hyvä ja odota, kunnes saat
          lisätietoa siitä, milloin pääset anomaan vuoroja. Kärsivällisyys
          palkitaan!
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <LayoutContainer breadcrumb={<MyBreadcrumb />}>
      <Welcome />
      <Row>
        <Col>
          <Card className="mb-4" style={{ minHeight: '20em' }}>
            <Card.Body>
              <WorkInProgress />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
