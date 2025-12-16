import Alert from 'react-bootstrap/Alert';
import { FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function DbError({ error }) {
  const { t } = useTranslation();
  if (!error) {
    return null;
  }
  return (
    <Alert variant="danger" className="text-white">
      <div className="d-flex align-items-center">
        <div className="ps-2 pe-3 d-none d-md-block">
          <FaExclamationCircle size={28} />
        </div>
        <div>
          <div>
            <strong>{t('Database error:')}</strong> {error?.message}
          </div>
          <code className="text-white">{error?.code}</code>
        </div>
      </div>
    </Alert>
  );
}
