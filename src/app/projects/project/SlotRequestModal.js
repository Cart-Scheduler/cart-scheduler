import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

import Time from '../../../components/Time';
import { WEEKDAYS } from '../../../services/date';
import {
  createSlotRequest,
  deleteSlotRequest,
  updateSlotRequest,
  usePerson,
  usePersonId,
} from '../../../services/db';

const MAX_PARTNERS = 3;

const getMembersOptions = (members, personId) =>
  Object.entries(members ?? {})
    .filter(([id]) => id !== personId)
    .map(([id, member]) => ({
      value: id,
      label: member.name,
    }));

function PartnerSelect(props) {
  const { t } = useTranslation();
  const [showHelp, setShowHelp] = useState(false);
  return (
    <Form.Group>
      <Form.Label>{t('Partners')}</Form.Label>
      <Select
        placeholder={t('Select...')}
        noOptionsMessage={() => t('No options')}
        isMulti
        {...props}
      />
      <Form.Text
        muted
        onClick={() => setShowHelp(!showHelp)}
        className="text-decoration-underline cursor-pointer dropdown-toggle"
      >
        {t("Can't find the name?")}
      </Form.Text>
      <Collapse in={showHelp}>
        <div id="help-partners" className="mt-2">
          {t('Make sure that your partner...')}
          <ol>
            <li>{t('has signed into this website')}</li>
            <li>{t('has entered his real full name')}</li>
            <li>{t('is accepted member of this project')}</li>
          </ol>
        </div>
      </Collapse>
    </Form.Group>
  );
}

function Title({ slot }) {
  const { t } = useTranslation();
  if (!slot) {
    return null;
  }
  const starts = new Date(slot.starts);
  const ends = new Date(slot.ends);
  return (
    <Modal.Title>
      {t(WEEKDAYS[starts.getDay()])} {starts.getDate()}.{starts.getMonth() + 1}.{' '}
      <Time date={starts} /> – <Time date={ends} />
    </Modal.Title>
  );
}

export default function SlotModal({
  show,
  onHide,
  projectId,
  slotId,
  slotRequestId,
  slotRequest,
  slot,
  members,
}) {
  const { data: person } = usePerson();
  const personId = usePersonId();
  const [partners, setPartners] = useState([]);
  const [touched, setTouched] = useState(false);
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

  const getNewPersons = () => {
    const persons = {
      [personId]: {
        name: person.name,
      },
    };
    partners.forEach((partner) => {
      if (partner?.value) {
        persons[partner.value] = { name: partner.label };
      }
    });
    return persons;
  };

  const handleCreateRequest = async () => {
    setProcessing(true);
    setError();
    try {
      await createSlotRequest({
        projectId,
        slotId,
        persons: getNewPersons(),
      });
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  const handleUpdateRequest = async () => {
    setProcessing(true);
    setError();
    try {
      await updateSlotRequest(slotRequestId, { persons: getNewPersons() });
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  const handleDeleteRequest = async () => {
    setProcessing(true);
    setError();
    try {
      await deleteSlotRequest(slotRequestId);
      onHide();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setProcessing(false);
  };

  // when slot request gets updated, update partners
  useEffect(() => {
    if (slotRequest?.persons) {
      let newPartners = Object.keys(slotRequest.persons)
        .filter((id) => id !== personId)
        .map((id) => ({
          value: id,
          label: slotRequest.persons[id].name,
        }));
      setPartners(newPartners);
    }
  }, [slotRequest, personId]);

  // clear errors when showing modal
  useEffect(() => {
    if (show) {
      setError();
      setTouched(false);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Title slot={slot} />
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/*
          <code>REQ: {JSON.stringify(slotRequest)}</code>
          <code>SLOT: {JSON.stringify(slot ?? {})}</code>
          */}
          {slotRequestId ? (
            <p>
              {t(
                'You have already sent a request for this cart shift. If you want to update the request, make the changes and press Update. You can cancel your request by pressing Remove request.',
              )}
            </p>
          ) : (
            <p>
              {t(
                'If you are available for this cart shift, fill the form and press Send request. Sending a request does not mean that your request is accepted. You will be informed about accepted requests.',
              )}
            </p>
          )}
          <PartnerSelect
            value={partners}
            onChange={(val) => {
              setPartners(val);
              setTouched(true);
            }}
            options={getMembersOptions(members, personId)}
            isOptionDisabled={() => partners.length >= MAX_PARTNERS}
          />
          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        <Modal.Footer
          className={slotRequestId ? 'justify-content-between' : ''}
        >
          {slotRequestId ? (
            <>
              <Button
                variant="danger"
                disabled={processing}
                onClick={handleDeleteRequest}
              >
                {t('Remove request')}
              </Button>
              <Button
                variant={touched ? 'warning' : 'light'}
                onClick={handleUpdateRequest}
                disabled={processing || !touched}
              >
                {t('Update request')}
              </Button>
            </>
          ) : (
            <Button
              variant="warning"
              onClick={handleCreateRequest}
              disabled={processing}
            >
              {t('Send request')}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
