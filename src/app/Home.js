import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import { LayoutContainer } from '../layouts/Default';
import Breadcrumb from '../layouts/Breadcrumb';
import { usePerson } from '../services/db';

function NameChecker() {
  const { isLoading, data: person } = usePerson();
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!isLoading && person) {
    if (person.name.trim().length === 0) {
      return (
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Body>
                <h5>{t('Welcome!')}</h5>
                <p>
                  {t(
                    'Get started by entering your name in the profile page so that others can recognize you.',
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
  }
  return null;
}

function MyBreadcrumb() {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={t('Home')}>
      <Breadcrumb.Item>{t('Home')}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function Home() {
  const { t } = useTranslation();
  return (
    <LayoutContainer breadcrumb={<MyBreadcrumb />}>
      <NameChecker />
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <h1>Home</h1>
              <Link to="/projects">{t('Projects')}</Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
