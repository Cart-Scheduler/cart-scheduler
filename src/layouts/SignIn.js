import { Outlet } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function SignInLayout() {
  return (
    <Container className="pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5} xxl={4}>
          <Card>
            <Card.Header className="pt-4 pb-4 text-center text-white bg-primary text-uppercase text-bold">
              Cart Scheduler
            </Card.Header>
            <Card.Body className="p-4">
              <Outlet />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
