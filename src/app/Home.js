import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';

import { LayoutContainer } from '../layouts/Default';
import Breadcrumb from '../layouts/Breadcrumb';
import { usePerson } from '../services/db';

function WelcomeChecker() {
  const { isLoading, data: person } = usePerson();
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!isLoading && person && person.created && !person.modified) {
    return (
      <Row>
        <Col>
          <Card className="mb-4 p-4">
            <Card.Body>
              <h5>{t('Welcome!')}</h5>
              <p>
                {t(
                  'Get started by providing information about you in the profile page.',
                )}
              </p>
              <Button
                className="bg-gradient-primary mb-0"
                onClick={() => navigate('/profile')}
              >
                {t('Profile')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
  return null;
}

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
      <WelcomeChecker />
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
