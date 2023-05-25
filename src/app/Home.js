import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

import RequestNotifications from '../components/RequestNotifications';

export default function Home() {
  return (
    <Container>
      <h1>Home</h1>
      <RequestNotifications />
      <Link to="/projects">Projects</Link>
    </Container>
  );
}
