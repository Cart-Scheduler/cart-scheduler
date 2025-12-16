import { useTranslation } from 'react-i18next';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import {
  addPersonToProject,
  deleteJoinRequest,
  useJoinRequests,
} from '../../../../../services/db';

function JoinRequest({ projectId, id, joinRequest }) {
  const { t } = useTranslation();
  const grant = async () => {
    try {
      await addPersonToProject(
        projectId,
        joinRequest.personId,
        joinRequest.name,
      );
      await deleteJoinRequest(id);
    } catch (err) {
      console.error(err);
    }
  };
  const deny = async () => {
    try {
      await deleteJoinRequest(id);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <li className="list-group-item border-0 d-flex justify-content-between">
      <div className="lh-sm">
        <div>
          <strong>{joinRequest.name}</strong>
        </div>
        {joinRequest.email && (
          <div className="text-muted">
            <small>{joinRequest.email}</small>
          </div>
        )}
      </div>
      <div>
        <Button variant="success" className="me-3" onClick={grant}>
          {t('Grant')}
        </Button>
        <Button variant="danger" onClick={deny}>
          {t('Deny')}
        </Button>
      </div>
    </li>
  );
}

export default function JoinRequestManager({ projectId }) {
  const { t } = useTranslation();
  const { docs } = useJoinRequests(projectId);
  if (!docs || Object.keys(docs).length === 0) {
    return null;
  }
  const joinRequests = Object.entries(docs);
  joinRequests.sort((a, b) => a[1].created - b[1].created);
  return (
    <Card className="mb-4">
      <Card.Header>
        <h6>
          {t('Join requests')} ({joinRequests.length})
        </h6>
      </Card.Header>
      <Card.Body>
        <ul className="list-group">
          {joinRequests.map(([id, doc]) => (
            <JoinRequest
              key={id}
              projectId={projectId}
              id={id}
              joinRequest={doc}
            />
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}
