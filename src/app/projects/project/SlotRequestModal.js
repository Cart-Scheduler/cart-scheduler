import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import CreatableSelect from 'react-select/creatable';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';

import {
  createMembersArray,
  genRandomString,
  nameSorter,
} from '../../../services/string';
import { useMemo } from 'react';

import NameMissing from '../../../components/NameMissing';
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

function PartnerSelect(props) {
  const { t } = useTranslation();
  return (
    <Form.Group>
      <Form.Label>{t('Partners')}</Form.Label>
      <CreatableSelect
        placeholder={t('Select...')}
        noOptionsMessage={() => t('No options')}
        formatCreateLabel={(val) => `${t('Add name')} "${val}"`}
        isMulti
        {...props}
      />
      <NameMissing />
    </Form.Group>
  );
}

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

function Assigned({ slot }) {
  const persons = Object.entries(slot.persons);
  persons.sort((a, b) => nameSorter(a[1].name, b[1].name));

  return (
    <ul>
      {persons.map(([id, person]) => (
        <li key={id}>{person.name}</li>
      ))}
    </ul>
  );
}

export default function SlotRequestModal({
  show,
  onHide,
  projectId,
  slotId,
  slotRequestId,
  slotRequest,
  slot,
  locationName,
  members,
}) {
  const { data: person } = usePerson();
  const personId = usePersonId();
  const [partners, setPartners] = useState([]);
  const [touched, setTouched] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState();
  const { t } = useTranslation();

  const memberOptions = useMemo(
    () => createMembersArray(members, personId),
    [members, personId],
  );

  const getNewPersons = () => {
    const persons = {
      // always include current person
      [personId]: {
        name: person.name,
      },
    };
    partners.forEach(({ value, label, __isNew__ }) => {
      if (__isNew__) {
        // user created a new name that does not exist in members
        persons[`_ext_${genRandomString(6)}`] = { name: label.trim() };
      } else if (value) {
        // user selected person who exists in members
        persons[value] = { name: label };
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

  const hasAssignment = Object.keys(slot?.persons ?? {}).length > 0;
  const currentIsAssigned = !!slot?.persons?.[personId];

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Title locationName={locationName} slot={slot} />
      </Modal.Header>
      <Form>
        <Modal.Body>
          {currentIsAssigned && (
            <p>
              <FaCheck className="me-2" />
              <strong>{t('You have been assigned to this cart shift.')}</strong>
            </p>
          )}
          {!currentIsAssigned && hasAssignment && (
            <p>{t('Assigned to this cart shift:')}</p>
          )}
          {hasAssignment && <Assigned slot={slot} />}
          {!hasAssignment && slotRequestId && (
            <p>
              {t(
                'You already have a request for this cart shift. If you want to update existing request, make the changes and press Save. You can cancel your request by pressing Remove request.',
              )}
            </p>
          )}
          {!hasAssignment && !slotRequestId && (
            <p>
              {t(
                'If you are available for this cart shift, fill the form and press Add request. Adding a request does not mean that your request is accepted. You will be informed about accepted requests.',
              )}
            </p>
          )}
          {!hasAssignment && (
            <PartnerSelect
              value={partners}
              onChange={(val) => {
                setPartners(val);
                setTouched(true);
              }}
              options={memberOptions}
              isOptionDisabled={() => partners.length >= MAX_PARTNERS}
            />
          )}
          {error && <Alert variant="danger">{t(error)}</Alert>}
        </Modal.Body>
        {!hasAssignment && (
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
                  {t('Save')}
                </Button>
              </>
            ) : (
              <Button
                variant="warning"
                onClick={handleCreateRequest}
                disabled={processing}
              >
                {t('Add request')}
              </Button>
            )}
          </Modal.Footer>
        )}
      </Form>
    </Modal>
  );
}
