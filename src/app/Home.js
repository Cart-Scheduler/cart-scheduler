import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container>
      <h1>Home</h1>
      <Link to="/projects">Projects</Link>
    </Container>
  );
}
