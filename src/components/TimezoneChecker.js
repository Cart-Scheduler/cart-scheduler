import React from 'react';
import Card from 'react-bootstrap/Card';
import { useTranslation } from 'react-i18next';

function TimezoneChecker() {
  const { t } = useTranslation();
  const defaultTimezone = process.env.REACT_APP_DEFAULT_TIMEZONE;
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log('Default timezone: ', defaultTimezone);
  console.log('Current timezone: ', currentTimezone);

  // Current tz default --> null
  if (currentTimezone === defaultTimezone) {
    return null;
  }

  // If in wrong timzone
  return (
    <Card className="mb-4">
      <Card.Body>
        {t(
          'You have set the wrong time zone, please check your time zone in the device settings',
        )}
      </Card.Body>
    </Card>
  );
}

export default TimezoneChecker;
