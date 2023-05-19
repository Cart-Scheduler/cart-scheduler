import Container from 'react-bootstrap/Container';

import Spinner from '../components/Spinner';

export default function AuthLoading() {
  return (
    <Container className="text-center pt-5">
      <Spinner />
    </Container>
  );
}
