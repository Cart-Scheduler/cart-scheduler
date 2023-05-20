import Container from 'react-bootstrap/Container';

import { usePerson } from '../services/user';

export default function Home() {
  usePerson();
  return (
    <Container>
      <h1>Home</h1>
    </Container>
  );
}
