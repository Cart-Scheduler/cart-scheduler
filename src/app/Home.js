import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';

import { LayoutContainer } from '../layouts/Default';
import Breadcrumb from '../layouts/Breadcrumb';

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
