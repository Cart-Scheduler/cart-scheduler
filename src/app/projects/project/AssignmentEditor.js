import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { updateSlotPersons } from '../../../services/db';
import {
  createMembersArray,
  genRandomString,
  nameSorter,
} from '../../../services/string';

export default function AssignmentEditor({
  slotId,
  slot,
  members,
  onComplete,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [touched, setTouched] = useState(false);
  const options = useMemo(() => createMembersArray(members), [members]);

  useEffect(() => {
    const newSelected = [];
    const personIds = Object.keys(slot?.persons ?? {}).sort((a, b) =>
      nameSorter(slot.persons[a]?.name || '', slot.persons[b]?.name || ''),
    );
    personIds.forEach((personId) => {
      newSelected.push({
        value: personId,
        label: slot.persons[personId]?.name || '',
      });
    });
    setSelected(newSelected);
  }, [slot?.persons]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    try {
      const newPersons = {};
      selected.forEach(({ value, label, __isNew__ }) => {
        if (__isNew__) {
          // user created a new name that does not exist in members
          newPersons[`_ext_${genRandomString(6)}`] = { name: label };
        } else {
          newPersons[value] = { name: label };
        }
      });
      await updateSlotPersons(slotId, newPersons);
      setTouched(false);
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Form onSubmit={handleSubmit} className="mb-3">
      <h6 className="text-uppercase text-body text-xs font-weight-bolder mb-3">
        {t('Accepted')}
      </h6>
      <Form.Group className="mb-2">
        <CreatableSelect
          value={selected}
          onChange={(value) => {
            setSelected(value);
            setTouched(true);
          }}
          options={options}
          isMulti
          placeholder={t('Select...')}
          noOptionsMessage={() => t('No options')}
          formatCreateLabel={(val) => `${t('Add name')} "${val}"`}
        />
      </Form.Group>
      <Form.Group className="text-end">
        <Button
          variant={touched ? 'primary' : 'light'}
          type="submit"
          disabled={!touched}
        >
          {t('Save')}
        </Button>
      </Form.Group>
    </Form>
  );
}
