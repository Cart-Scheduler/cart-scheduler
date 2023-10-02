import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import addDays from 'date-fns/addDays';
import endOfWeek from 'date-fns/endOfWeek';
import endOfMonth from 'date-fns/endOfMonth';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import startOfWeek from 'date-fns/startOfWeek';
import startOfMonth from 'date-fns/startOfMonth';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

import { MONTHS, getWeekStart } from '../../../../../services/date';

import './MonthCalendar.css';

const splitMonth = (month) => [Math.floor(month / 12), month % 12];

function MonthName({ month }) {
  const [year, mon] = splitMonth(month);
  const { t } = useTranslation();
  return (
    <h4 className="header-title">
      {t(MONTHS[mon])} {year}
    </h4>
  );
}

function MonthHeader({ month, onPrev, onNext }) {
  return (
    <div className="calendar-month-header">
      <Button
        type="button"
        variant="outline-secondary"
        className="btn-nav btn-prev"
        onClick={onPrev}
      >
        <FaAngleLeft />
      </Button>
      <div>
        <MonthName month={month} />
      </div>
      <Button
        type="button"
        variant="outline-secondary"
        className="btn-nav btn-next"
        onClick={onNext}
      >
        <FaAngleRight />
      </Button>
    </div>
  );
}

function Day({ date, status, isToday, isSelected, onClick, loading }) {
  const classes = ['calendar-day', `calendar-day-${status}`];
  if (isToday) {
    classes.push('calendar-day-today');
  }
  return (
    <button className={classes.join(' ')} onClick={() => onClick(date)}>
      <div>{date.getDate()}</div>
    </button>
  );
}

function Week({ dates, selected, today, onDaySelect, loading }) {
  return (
    <div className="calendar-week">
      {dates.map((day) => (
        <Day
          key={day.date.getTime()}
          date={day.date}
          isToday={isSameDay(today, day.date)}
          onClick={onDaySelect}
        />
      ))}
    </div>
  );
}

function Month({ month, selected, today, onDaySelect }) {
  const [year, mon] = splitMonth(month);

  let date = startOfWeek(startOfMonth(new Date(year, mon, 1)), {
    weekStartsOn: getWeekStart(),
  });
  const end = endOfWeek(endOfMonth(new Date(year, mon, 1)), {
    weekStartsOn: getWeekStart(),
  });

  let i = 0;
  const weeks = [];
  while (isBefore(date, end) || isSameDay(date, end)) {
    const week = [];
    for (let j = 0; j < 7; j++, i++) {
      week.push({
        date,
      });
      date = addDays(date, 1);
    }
    weeks.push(week);
  }
  return weeks.map((week) => (
    <Week
      key={week[0].date.getTime()}
      dates={week}
      selected={selected}
      today={today}
      onDaySelect={onDaySelect}
    />
  ));
}

export default function Calendar({ selected, onDaySelect }) {
  const today = new Date();
  const [month, setMonth] = useState(
    () => today.getFullYear() * 12 + today.getMonth(),
  );
  return (
    <div className="border rounded">
      <MonthHeader
        month={month}
        onPrev={() => setMonth(month - 1)}
        onNext={() => setMonth(month + 1)}
      />
      <div className="p-2">
        <Month
          month={month}
          today={today}
          selected={selected}
          onDaySelect={onDaySelect}
        />
      </div>
    </div>
  );
}
