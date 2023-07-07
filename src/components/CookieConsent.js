import { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', true);
    setShow(false);
  };

  return (
    <Offcanvas
      show={show}
      backdrop="static"
      placement="bottom"
      className="h-auto overflow-auto"
    >
      <Container>
        <Offcanvas.Header closeButton={false} className="pb-2 pt-4">
          <Offcanvas.Title className="mt-1">
            {t('Cookie Consent')}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mb-4">
            {t(
              'This website uses cookies and similar technologies. By continuing to use this site, you agree to the use of these technologies as described in',
            )}{' '}
            <Link to="/privacy-policy">{t('Privacy Policy')}</Link>.
          </div>
          <div className="d-flex justify-content-end">
            <Button
              variant="primary"
              className="mx-1 bg-gradient-primary"
              onClick={handleAccept}
            >
              {t('Accept')}
            </Button>
          </div>
        </Offcanvas.Body>
      </Container>
    </Offcanvas>
  );
}
