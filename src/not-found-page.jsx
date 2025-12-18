import { Container, Card } from 'react-bootstrap';

export function NotFoundPage() {
  return (
    <Container className="py-2 py-md-5 px-3">
      <div className="text-center py-5">
        <Card
          className="shadow-lg mt-n4 mt-md-n5 border-radius-lg border-0 mx-auto"
          style={{ maxWidth: '600px' }}
        >
          <Card.Body className="p-3 p-md-5">
            <h2 className="display-4 mb-4 text-primary fw-bold">404</h2>
            <h4 className="text-dark mb-4 fw-normal px-2">Sivua ei löytynyt</h4>
            <p
              className="mb-5 text-muted px-2 px-md-4"
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.6',
              }}
            >
              Valitettavasti etsimääsi osoitetta ei ole olemassa.
              <span className="d-block d-md-inline mt-2 mt-md-0">
                Tarkista osoite ja yritä uudestaan.
              </span>
            </p>
            <a
              href="/projects"
              className="btn btn-primary btn-lg px-5 shadow w-100 w-md-auto"
            >
              Siirry etusivulle
            </a>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
