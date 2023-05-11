import { Container, Row, Col, Card } from 'react-bootstrap';

function Layout({ children }) {
  return (
    <div className="pt-2 pt-sm-5 pb-4 pb-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5} xxl={4}>
            <Card>
              <Card.Header className="pt-4 pb-4 text-center text-white bg-primary text-uppercase">
                Cart Scheduler
              </Card.Header>
              <Card.Body className="p-4">{children}</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default function Login() {
  return <Layout>Login form</Layout>;
}
