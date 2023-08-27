import { useCallback, useEffect, useId, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaExclamation, FaExclamationTriangle } from 'react-icons/fa';

import AssignmentEditor from '../../AssignmentEditor';
import { WEEKDAYS, calcSlotDistance } from '../../../../../services/date';
import { deleteSlot } from '../../../../../services/db';
import Time from '../../../../../components/Time';

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

const DISTANCE_WARNING_THRESHOLD = 3 * 60 * 60 * 1000;

function ProximityWarning({ closestSlot }) {
  if (!closestSlot) {
    return null;
  }
  const { distance } = closestSlot;
  if (distance < 0) {
    // overlapping slot
    return (
      <span className="text-danger">
        <FaExclamationTriangle />
      </span>
    );
  }
  if (distance === 0) {
    // consecutive slot
    return (
      <span className="text-warning">
        <FaExclamation />
      </span>
    );
  }
  if (distance < DISTANCE_WARNING_THRESHOLD) {
    return (
      <span className="text-secondary text-sm">
        <FaExclamation />
      </span>
    );
  }
  return null;
}

const checkClosestSlot = (personalSlots, draftSlots, slot, slots) => {
  let minDistance;
  const check = (slotId) => {
    const distance = calcSlotDistance(slot, slots[slotId]);
    if (minDistance === undefined || distance < minDistance.distance) {
      minDistance = { distance, slotId };
    }
  };
  (personalSlots ?? []).forEach((id) => check(id));
  (draftSlots ?? []).forEach((id) => check(id));
  return minDistance;
};

function SlotPreview({ slot }) {
  const { t } = useTranslation();
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  const locationName = slot.locationId;
  return (
    <div>
      {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.{starts.getMonth() + 1}.{' '}
      <Time date={starts} /> – <Time date={ends} /> {locationName}
    </div>
  );
}

function Distance({ distance }) {
  const hours = distance / 3600000;
  return <span>{hours}</span>;
}

function ClosestSlotInfo({ slot, closestSlot, slots }) {
  const { t } = useTranslation();
  if (!closestSlot) {
    return <span>{t('No shifts.')}</span>;
  }
  const { distance, slotId } = closestSlot;
  if (distance < 0) {
    return <span>{t('Another shift at the same time!')}</span>;
  }
  const otherSlot = slots[slotId];
  const otherIsLater = otherSlot.starts > slot.starts;
  if (distance === 0) {
    return (
      <div>
        {t(otherIsLater ? 'The next shift is' : 'The previous shift is')}{' '}
        <strong>{t('consecutive')}</strong>
        :
        <SlotPreview slot={otherSlot} />
      </div>
    );
  }
  return (
    <div>
      <strong>
        <Distance distance={distance} />
      </strong>{' '}
      {t(
        otherIsLater
          ? 'hour(s) between with the next shift'
          : 'hour(s) between with the previous shift',
      )}
      :
      <SlotPreview slot={otherSlot} />
    </div>
  );
}

function SlotCount({ personalSlots, draftSlots, slot, slots }) {
  const slotCount = personalSlots?.length ?? 0;
  const draftCount = draftSlots?.length ?? 0;
  const closestSlot = checkClosestSlot(personalSlots, draftSlots, slot, slots);
  const popoverId = useId();
  const popover = (
    <Popover id={popoverId}>
      <Popover.Body>
        <ClosestSlotInfo slot={slot} closestSlot={closestSlot} slots={slots} />
      </Popover.Body>
    </Popover>
  );
  return (
    <>
      <OverlayTrigger placement="top" overlay={popover}>
        {(triggerProps) => (
          <Badge pill bg="primary" {...triggerProps}>
            {slotCount}
            {draftCount > 0 && <span> + {draftCount}</span>}
          </Badge>
        )}
      </OverlayTrigger>
      <ProximityWarning closestSlot={closestSlot} />
    </>
  );
}

function RequestCount({ personId, reqsByPerson }) {
  const count = reqsByPerson[personId]?.length ?? 0;
  return (
    <Badge pill bg="warning">
      {count}
    </Badge>
  );
}

function SlotRequestPerson({
  personId,
  person,
  slot,
  slots,
  slotsByPerson,
  draftSlotsByPerson,
  reqsByPerson,
}) {
  return (
    <Row className="align-items-center">
      <Col sm={6}>
        <h6 className="text-dark text-sm mb-0">{person?.name}</h6>
      </Col>
      <Col sm={6}>
        <Stack direction="horizontal" gap={1}>
          <SlotCount
            personalSlots={slotsByPerson[personId]}
            draftSlots={draftSlotsByPerson[personId]}
            slot={slot}
            slots={slots}
          />
          <RequestCount personId={personId} reqsByPerson={reqsByPerson} />
        </Stack>
      </Col>
    </Row>
  );
}

function SlotRequest({
  id,
  slotRequest,
  selected,
  slot,
  slots,
  slotsByPerson,
  draftSlotsByPerson,
  reqsByPerson,
  onClick,
}) {
  return (
    <li className="list-group-item border-0 d-flex align-items-center request-list-item bg-gray-100 mb-1">
      <div
        className={`request-list-item-check pe-3 cursor-pointer ${
          selected ? 'text-dark' : 'text-white'
        }`}
        onClick={onClick}
      >
        <FaCheck />
      </div>
      <div className="flex-grow-1">
        {Object.keys(slotRequest.persons ?? {}).map((personId) => (
          <SlotRequestPerson
            key={personId}
            personId={personId}
            person={slotRequest.persons[personId]}
            slot={slot}
            slots={slots}
            slotsByPerson={slotsByPerson}
            draftSlotsByPerson={draftSlotsByPerson}
            reqsByPerson={reqsByPerson}
          />
        ))}
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
  slots,
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

  // for debugging
  useEffect(() => {
    console.debug('slotId', slotId);
  }, [slotId]);

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

  const canDelete = slot && Object.keys(slot.persons ?? {}).length === 0;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Title locationName={locationName} slot={slot} />
      </Modal.Header>
      <Modal.Body>
        <AssignmentEditor slotId={slotId} slot={slot} members={members} />
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
              slot={slot}
              slots={slots}
              slotsByPerson={slotsByPerson}
              draftSlotsByPerson={draftSlotsByPerson}
              reqsByPerson={reqsByPerson}
              onClick={() => onRequestToggle(reqId, slotRequests[reqId])}
            />
          ))}
        </ul>
        {error && <Alert variant="danger">{t(error)}</Alert>}
      </Modal.Body>
      {canDelete && (
        <Modal.Footer className="justify-content-between">
          <Button variant="danger" disabled={processing} onClick={handleDelete}>
            {t('Delete slot')}
          </Button>
        </Modal.Footer>
      )}
      {/*
      <Modal.Footer className="justify-content-between">
        <Button variant="danger" disabled={processing} onClick={handleDelete}>
          {t('Delete')}
        </Button>
        <Button variant="primary" type="submit" disabled={processing}>
          {t('Save')}
        </Button>
      </Modal.Footer>
      */}
    </Modal>
  );
}
