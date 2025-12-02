import { Container } from 'react-bootstrap';

import Spinner from './Spinner';

export default function AuthLoading() {
  return (
    <Container className="text-center pt-5">
      <Spinner />
    </Container>
  );
}
