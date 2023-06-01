import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { LayoutContainer } from '../../../layouts/Default';
import Breadcrumb from '../../../layouts/Breadcrumb';
import { useProject, useSlots } from '../../../services/db';

const HOUR_ROW_HEIGHT = 50;

const hourStyle = {
  height: `${HOUR_ROW_HEIGHT}px`,
};

const hourDigitStyle = {
  height: `${HOUR_ROW_HEIGHT}px`,
  fontSize: '10px',
  position: 'relative',
  top: '-8px',
  paddingRight: '8px',
};

function HourDigit({ children }) {
  return (
    <div style={hourDigitStyle} className="">
      {children}
    </div>
  );
}

function Hour() {
  return <div style={hourStyle} className="cal-hour-row" />;
}

function HourDigits() {
  return (
    <div className="">
      <HourDigit>08:00</HourDigit>
      <HourDigit>09:00</HourDigit>
      <HourDigit>10:00</HourDigit>
      <HourDigit>11:00</HourDigit>
      <HourDigit>12:00</HourDigit>
      <HourDigit>13:00</HourDigit>
      <HourDigit>14:00</HourDigit>
      <HourDigit>15:00</HourDigit>
      <HourDigit>16:00</HourDigit>
      <HourDigit>17:00</HourDigit>
    </div>
  );
}

function Hours() {
  return (
    <div className="">
      <Hour />
      <Hour />
      <Hour />
      <Hour />
      <Hour />
      <Hour />
      <Hour />
      <Hour />
      <Hour />
      <Hour />
    </div>
  );
}

function Slot({ start }) {
  const style2 = {
    width: '100%',
    borderRadius: '3px',
    zIndex: 5,
    position: 'absolute',
    cursor: 'pointer',
  };
  style2.top = `${start * HOUR_ROW_HEIGHT}px`;
  const handleClick = () => {
    console.debug('Whee.');
  };
  return (
    <div style={style2} className="cal-slot" onClick={handleClick}>
      John Smith
    </div>
  );
}

function DayCol() {
  const myStyle = {
    position: 'relative',
    width: 'calc(100% - 1em)',
    height: '100%',
    paddingRight: '3em',
    fontSize: '12px',
  };
  return (
    <div className="cal-day-col">
      <div style={myStyle} className="text-white">
        <Slot start={5} />
      </div>
      <div className="text-center">Mon 22</div>
    </div>
  );
}

function Calendar() {
  return (
    <div className="cal-container">
      <div className="cal-content pt-3">
        <HourDigits />
        <Hours />
        <DayCol />
        <DayCol />
        <DayCol />
        <DayCol />
        <DayCol />
        <DayCol />
        <DayCol />
      </div>
    </div>
  );
}

function MyBreadcrumb({ project }) {
  const { t } = useTranslation();
  return (
    <Breadcrumb title={project?.name}>
      <Breadcrumb.Item to="/">{t('Home')}</Breadcrumb.Item>
      <Breadcrumb.Item to="/projects">{t('Projects')}</Breadcrumb.Item>
      <Breadcrumb.Item>{project?.name}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default function Project() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useProject(projectId);
  const starts = new Date('2022-05-22T04:00:00');
  const ends = new Date('2022-05-22T05:00:00');
  const { docs: slots, isLoading: slotsLoading } = useSlots(
    projectId,
    starts,
    ends,
  );
  console.debug('project', project);
  console.debug('slots', slots, slotsLoading);
  const { t } = useTranslation();
  // TODO: remember when rendering slots, some slots can be longer
  // than their siblings.
  //
  //  8AM            --------
  //  9AM  --------  | SLOT |
  // 10AM  | SLOT |  |      |
  // 11AM  -------   |      |
  // 12PM            --------
  return (
    <LayoutContainer fluid breadcrumb={<MyBreadcrumb project={project} />}>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header>
              <h6>{project?.name}</h6>
            </Card.Header>
            <Card.Body>
              <Calendar />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutContainer>
  );
}
