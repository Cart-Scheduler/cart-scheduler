import Form from 'react-bootstrap/Form';

import { formatTime } from '../services/date';

const genOptions = () => {
  const opts = [];
  for (let i = 0; i < 96; i++) {
    const hours = Math.floor(i / 4);
    const mins = (i % 4) * 15;
    const time = formatTime(hours, mins);
    opts.push({ value: time, label: time });
  }
  return opts;
};

const OPTIONS = genOptions();

export default function TimeSelect({ value, onChange }) {
  return (
    <Form.Select value={value} onChange={(evt) => onChange(evt.target.value)}>
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Form.Select>
  );
}
