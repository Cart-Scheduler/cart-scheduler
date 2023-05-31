import { useState } from 'react';

import { useRegistrationToken } from '../../services/messaging';
import PermissionModal from './PermissionModal';

function TokenController() {
  useRegistrationToken();
  return null;
}

function PermissionChecker() {
  const [permission, setPermission] = useState(Notification.permission);
  const [showModal, setShowModal] = useState(true);

  if (permission === 'denied') {
    // do nothing
    return null;
  }

  if (permission === 'granted') {
    return <TokenController />;
  }

  const reqPermission = async () => {
    const newPermission = await Notification.requestPermission();
    setPermission(newPermission);
    setShowModal(false);
  };

  return (
    <PermissionModal
      show={showModal}
      onHide={() => setShowModal(false)}
      onContinue={reqPermission}
    />
  );
}

export default function NotificationController() {
  // check support for notification api
  return 'Notification' in window ? <PermissionChecker /> : null;
}
