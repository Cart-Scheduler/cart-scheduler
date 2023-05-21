import Container from 'react-bootstrap/Container';
import RequestNotifications from '../components/RequestNotifications';

export default function Home() {
  return (
    <Container>
      <h1>Home</h1>
      <RequestNotifications />
    </Container>
  );
}
