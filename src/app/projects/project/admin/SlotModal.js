import { useCallback, useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';

import { WEEKDAYS } from '../../../../services/date';
import { deleteSlot } from '../../../../services/db';
import Time from '../../../../components/Time';

function Title({ locationName, slot }) {
  const { t } = useTranslation();
  if (!slot) {
    return null;
  }
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  return (
    <Modal.Title>
      {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.{starts.getMonth() + 1}.{' '}
      <Time date={starts} /> – <Time date={ends} /> {locationName}
    </Modal.Title>
  );
}

function SlotCount({ personId, slotsByPerson, draftSlotsByPerson }) {
  const slotCount = slotsByPerson[personId]?.length ?? 0;
  const draftCount = draftSlotsByPerson[personId]?.length ?? 0;
  return (
    <Badge variant="primary" className="ms-1">
      {slotCount}
      {draftCount > 0 && <span> + {draftCount}</span>}
    </Badge>
  );
}

function RequestCount({ personId, reqsByPerson }) {
  const count = reqsByPerson[personId]?.length ?? 0;
  return (
    <Badge variant="warning" className="ms-1 bg-warning">
      {count}
    </Badge>
  );
}

function SlotRequest({
  id,
  slotRequest,
  selected,
  slotsByPerson,
  draftSlotsByPerson,
  reqsByPerson,
  onClick,
}) {
  const names = Object.values(slotRequest.persons ?? {})
    .map((person) => person.name)
    .join(', ');

  const personIds = Object.keys(slotRequest.persons ?? {});
  const counters = personIds.map((personId) => (
    <span key={personId}>
      <SlotCount
        personId={personId}
        slotsByPerson={slotsByPerson}
        draftSlotsByPerson={draftSlotsByPerson}
      />
      <RequestCount personId={personId} reqsByPerson={reqsByPerson} />
    </span>
  ));
  return (
    <li
      className="list-group-item border-0 d-flex cursor-pointer request-list-item bg-gray-100 mb-1"
      onClick={onClick}
    >
      <div className={`me-3 ${selected ? 'text-dark' : 'text-white'}`}>
        <FaCheck />
      </div>
      <div>
        <h6 className="text-dark text-sm mb-0">{names}</h6>
        <div>{counters}</div>
      </div>
    </li>
  );
}

// helper function for sorting slot requests
const getLowestCount = (req, data) => {
  const values = Object.keys(req?.persons ?? {}).map(
    (pid) => data[pid]?.length ?? 0,
  );
  return Math.min(...values);
};

export default function SlotModal({
  show,
  onHide,
  projectId,
  slotId,
  slotRequestId,
  slotRequest,
  slot,
  slotRequests,
  locationName,
  members,
  selectedRequests,
  slotsByPerson,
  draftSlotsByPerson,
  reqsByPerson,
  onRequestToggle,
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();
  const { t } = useTranslation();

  const create = async () => {
    setProcessing(true);
    setError();
    try {
      // TODO
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    create();
  };

  const handleDelete = async () => {
    setProcessing(true);
    setError();
    try {
      await deleteSlot(slotId);
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  // clear errors when showing modal
  useEffect(() => {
    if (show) {
      setError();
    }
  }, [show]);

  /*
  const dispatch = useDispatch();
  const selected = useSelector((state) => state.assign.selected);
  const isSelected = (reqId) => Object.keys(selected ?? {}).includes(reqId);
  const handleRequestClick = (reqId) => {
    dispatch(toggleSelected(reqId));
  };
  */

  const reqIds = Object.keys(slotRequests);
  const requestSorter = useCallback(
    (a, b) => {
      const aSlotCount = getLowestCount(slotRequests[a], slotsByPerson);
      const bSlotCount = getLowestCount(slotRequests[b], slotsByPerson);
      if (aSlotCount === bSlotCount) {
        const aReqCount = getLowestCount(slotRequests[a], reqsByPerson);
        const bReqCount = getLowestCount(slotRequests[b], reqsByPerson);
        return aReqCount - bReqCount;
      }
      return aSlotCount - bSlotCount;
    },
    [slotRequests, slotsByPerson, reqsByPerson],
  );
  reqIds.sort(requestSorter);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Title locationName={locationName} slot={slot} />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <h6 className="text-uppercase text-body text-xs font-weight-bolder mb-3">
            {t('Requests')} ({Object.keys(slotRequests).length})
          </h6>
          <ul className="list-group">
            {reqIds.map((reqId) => (
              <SlotRequest
                key={reqId}
                id={reqId}
                slotRequest={slotRequests[reqId]}
                selected={selectedRequests[reqId]}
                slotsByPerson={slotsByPerson}
                draftSlotsByPerson={draftSlotsByPerson}
                reqsByPerson={reqsByPerson}
                onClick={() => onRequestToggle(reqId, slotRequests[reqId])}
              />
            ))}
          </ul>
          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          {/*
          <Button variant="danger" disabled={processing} onClick={handleDelete}>
            {t('Delete')}
          </Button>
          <Button variant="primary" type="submit" disabled={processing}>
            {t('Save')}
          </Button>
          */}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
