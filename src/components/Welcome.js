import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { FaChrome, FaEllipsisV, FaSafari } from 'react-icons/fa';
import { IoShareOutline } from 'react-icons/io5';

import { usePerson } from '../services/db';

export default function Welcome() {
  const { isLoading, data: person } = usePerson();
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!isLoading && person && person.created && !person.modified) {
    return (
      <Row>
        <Col>
          <Card className="mb-4 p-4">
            <Card.Body>
              <h5>{t('Welcome!')}</h5>
              <p>
                {t(
                  'To get the best user experience, add this site to the home screen of your mobile device. This way you can use the service quickly and smoothly.',
                )}
              </p>
              <ul style={{ listStyle: 'none' }}>
                <li className="mb-3">
                  <h6>
                    <FaChrome /> Google Chrome
                  </h6>
                  {t('Press menu button')} <FaEllipsisV />{' '}
                  {t('in the upper right corner and then')}{' '}
                  <strong>{t('CHROME.Add to Home screen')}</strong>.
                </li>
                <li className="mb-3">
                  <h6>
                    <FaSafari /> Safari
                  </h6>
                  {t('Press share button')} <IoShareOutline />{' '}
                  {t('and then select')}{' '}
                  <strong>{t('SAFARI.Add to Home screen')}</strong>.
                </li>
              </ul>
              <p>
                {t(
                  'After this provide information about you in the profile page.',
                )}
              </p>
              <Button
                className="bg-gradient-primary mb-0"
                onClick={() => navigate('/profile')}
              >
                {t('Profile')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
  return null;
}
