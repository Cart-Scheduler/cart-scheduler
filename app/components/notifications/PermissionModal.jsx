import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

export default function NotificationsModal({ show, onHide, onContinue }) {
  const { t } = useTranslation();
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Notifications')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('This site uses notifications for informing users.')}</p>
        <p>
          {t(
            'If you want to receive notifications, please press Continue and then Allow.',
          )}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          className="bg-gradient-primary"
          onClick={onContinue}
        >
          {t('Continue')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
