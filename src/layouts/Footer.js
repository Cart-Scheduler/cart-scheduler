import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <Container fluid>
        <Row className="align-items-center justify-content-lg-between">
          <Col className="mb-lg-0 mb-4">
            <div className="copyright text-center text-xs text-muted text-lg-start">
              {process.env.REACT_APP_TITLE}{' '}
              {t(
                'is a service maintained by private individuals and is based on open source project',
              )}{' '}
              <a href="https://github.com/Cart-Scheduler/Cart-Scheduler">
                Cart&nbsp;Scheduler
              </a>
              .
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
