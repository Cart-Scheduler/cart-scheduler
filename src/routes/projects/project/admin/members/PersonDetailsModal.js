import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { queryPerson } from '../../../../../services/functions';

function Content({ projectId, personId }) {
  const [person, setPerson] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    const run = async () => {
      const data = await queryPerson({ projectId, personId });
      setPerson(data);
    };
    run();
  }, [projectId, personId]);

  let emails = '';
  if (person.emails) {
    emails = person.emails.join(', ');
  }

  return (
    <div>
      <h6 className="mb-0 text-sm">{t('Email address')}</h6>
      <p className="text-xs text-secondary mb-0">{emails}</p>
    </div>
  );
}

export default function PersonDetailsModal({
  show,
  onHide,
  projectId,
  personId,
}) {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Person details')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {show && <Content projectId={projectId} personId={personId} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide}>
          {t('Close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
