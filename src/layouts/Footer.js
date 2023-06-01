import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Footer() {
  return (
    <footer className="footer pt-3">
      <Container fluid>
        <Row className="align-items-center justify-content-lg-between">
          <Col className="mb-lg-0 mb-4">
            <div className="copyright text-center text-sm text-muted text-lg-start">
              Cart Scheduler
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
