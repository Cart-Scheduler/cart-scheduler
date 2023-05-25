import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { useUid, useListenUser } from '../services/db';
import { setupMessaging } from '../services/messaging';

function NotificationsModal({ show, onHide, onContinue }) {
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

export default function RequestNotifications() {
  const [showModal, setShowModal] = useState(true);
  const uid = useUid();
  const user = useListenUser();

  const support = 'Notification' in window;
  if (!support) {
    // no browser support for notification api
    return null;
  }

  if (
    Notification.permission === 'granted' ||
    Notification.permission === 'denied'
  ) {
    // permission already asked
    return null;
  }

  const reqPermission = async () => {
    const permission = await Notification.requestPermission();
    setShowModal(false);
    if (permission === 'granted') {
      await setupMessaging(uid, user);
    }
  };

  return (
    <NotificationsModal
      show={showModal}
      onHide={() => setShowModal(false)}
      onContinue={reqPermission}
    />
  );
}
