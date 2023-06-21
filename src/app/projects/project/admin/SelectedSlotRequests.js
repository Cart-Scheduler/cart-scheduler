import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { WEEKDAYS } from '../../../../services/date';
import { acceptSlotRequests } from '../../../../services/functions';
import Time from '../../../../components/Time';

function SlotRequest({ id, projectId }) {
  const { t } = useTranslation();
  const slotRequest = useSelector((state) => state.db[`slotRequests/${id}`]);
  const slot = useSelector((state) => state.db[`slots/${slotRequest?.slotId}`]);
  const project = useSelector((state) => state.db[`projects/${projectId}`]);
  if (!slotRequest || !slot || !project) {
    return null;
  }
  const locationName = project.locations[slot.locationId].name;
  const names = Object.values(slotRequest.persons ?? {})
    .map((person) => person.name)
    .join(', ');
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  return (
    <li className="list-group-item border-0 d-flex justify-content-between">
      <div>
        {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.
        {starts.getMonth() + 1}. <Time date={starts} /> – <Time date={ends} />{' '}
        {locationName} <strong>{names}</strong>
      </div>
    </li>
  );
}

const checkReqStart = (db, reqId) => {
  const slotRequest = db[`slotRequests/${reqId}`];
  const slot = db[`slots/${slotRequest?.slotId}`];
  if (!slotRequest || !slot) {
    return 0;
  }
  return slot.starts;
};

export default function SelectedSlotRequests({
  projectId,
  slotRequests,
  onReset,
}) {
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation();
  const requestIds = Object.keys(slotRequests);
  const db = useSelector((state) => state.db);
  if (requestIds.length === 0) {
    return null;
  }
  requestIds.sort((a, b) => checkReqStart(db, a) - checkReqStart(db, b));

  const handleAccept = async () => {
    setProcessing(true);
    try {
      await acceptSlotRequests({ slotRequestIds: requestIds });
      // slot requests are deleted after accepted
      onReset();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };
  return (
    <Row>
      <Col>
        <Card className="mb-4">
          <Card.Header>
            <h6>
              {t('Selected requests')} ({requestIds.length})
            </h6>
          </Card.Header>
          <Card.Body>
            <ul className="list-group">
              {requestIds.map((id) => (
                <SlotRequest key={id} projectId={projectId} id={id} />
              ))}
            </ul>
            {error && <Alert variant="danger">{error}</Alert>}
            <div>
              <Button variant="light" className="me-3" onClick={onReset}>
                {t('Cancel')}
              </Button>
              <Button
                variant="success bg-gradient"
                className="me-3"
                onClick={handleAccept}
                disabled={processing}
              >
                {t('Accept requests')}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
