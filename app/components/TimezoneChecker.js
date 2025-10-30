import Alert from 'react-bootstrap/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function TimezoneChecker() {
  const { t } = useTranslation();
  const defaultTimezone = process.env.REACT_APP_DEFAULT_TIMEZONE;
  if (
    !defaultTimezone ||
    !Intl ||
    !Intl.DateTimeFormat ||
    !Intl.DateTimeFormat().resolvedOptions ||
    !Intl.DateTimeFormat().resolvedOptions().timeZone
  ) {
    return null;
  }
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Current tz default --> null
  if (currentTimezone === defaultTimezone) {
    return null;
  }

  return (
    <Alert variant="danger" className="text-white">
      <div className="d-flex align-items-center">
        <div className="ps-2 pe-3 d-none d-md-block">
          <FaExclamationCircle size={28} />
        </div>
        <div>
          <p className="mb-2">
            {t(
              'Shifts and times can be incorrect, because the timezone of your device and the website are different:',
            )}
          </p>
          <ul className="mb-1">
            <li>
              <strong>{t('Timezone in your device:')}</strong> {currentTimezone}
            </li>
            <li>
              <strong>{t('Website timezone:')}</strong> {defaultTimezone}
            </li>
          </ul>
          <p className="mb-1">
            {t(
              'We recommend that you use automatic timezone setting in your device settings.',
            )}
          </p>
        </div>
      </div>
    </Alert>
  );
}

export default TimezoneChecker;
