import { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CookieConsent(props) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = (e) => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

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

  const offcanvasStyle = windowWidth <= 768 ? { height: '36%' } : {};

  return (
    <Offcanvas
      show={show}
      onHide={() => {}}
      backdrop="static"
      placement="bottom"
      style={offcanvasStyle}
      {...props}
    >
      <Container className="mx-auto">
        <Offcanvas.Header closeButton={false} className="mx-auto pb-2 pt-4">
          <Offcanvas.Title className="mx-1 mt-1">
            {t('Cookie Consent')}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="mx-1">
          <div className="mb-4">
            {t(
              'To provide you with the best possible experience, we use cookies and similar technologies. By continuing to use our site, you agree to the use of cookies as described in our ',
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
