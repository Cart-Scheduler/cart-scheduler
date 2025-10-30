import { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaRegCopy } from 'react-icons/fa';

import Time from '../../../../components/Time';
import { WEEKDAYS, formatTime } from '../../../../services/date';
import { filterSlotsByRange } from '../../../../services/slot';
import { filterObj } from '../../../../services/object';

function Slot({ slot }) {
  const starts = new Date(slot.starts);
  const persons = Object.values(slot.persons ?? {});
  const names = persons.map((person) => person.name);
  const txt = names.join(', ');
  return (
    <div>
      <Time date={starts} /> {txt}
    </div>
  );
}

function CopyButton({ onClick }) {
  const [clicked, setClicked] = useState(false);
  const handle = () => {
    setClicked(true);
    onClick();
  };
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => {
        setClicked(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [clicked]);
  return (
    <Button variant="link" onClick={handle} className="float-end">
      {clicked ? <FaCheck size={24} /> : <FaRegCopy size={24} />}
    </Button>
  );
}

export default function AssignmentListModal({
  show,
  onHide,
  slots,
  starts,
  ends,
  locationId,
}) {
  const { t } = useTranslation();

  const locationSlots = useMemo(() => {
    const filteredSlots = filterSlotsByRange(slots, starts, ends);
    const obj = filterObj(
      filteredSlots,
      ([id, doc]) => doc.locationId === locationId,
    );
    const arr = Object.keys(obj);
    arr.sort((a, b) => {
      const aStarts = slots[a].starts;
      const bStarts = slots[b].starts;
      if (aStarts < bStarts) return -1;
      if (aStarts > bStarts) return 1;
      return 0;
    });
    return arr;
  }, [slots, locationId, starts, ends]);

  let txt = '';
  let slotDate = null;

  const copy = async () => {
    await navigator.clipboard.writeText(txt);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{t('Assignment list')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CopyButton onClick={copy} />
        {locationSlots.map((slotId) => {
          const starts = new Date(slots[slotId].starts);
          const date = `${t(WEEKDAYS[starts.getDay()])} ${starts.getDate()}.${
            starts.getMonth() + 1
          }.`;
          let dateComponent = null;
          if (date !== slotDate) {
            dateComponent = <strong>{date}</strong>;
            slotDate = date;
            txt += date + '\n';
          }

          const slot = slots[slotId];
          const persons = Object.values(slot.persons ?? {});
          const names = persons.map((person) => person.name);
          txt += formatTime(starts.getHours(), starts.getMinutes()) + ' ';
          txt += names.join(', ') + '\n';

          return (
            <div key={slotId}>
              {dateComponent}
              <Slot slot={slots[slotId]} />
            </div>
          );
        })}
      </Modal.Body>
    </Modal>
  );
}
