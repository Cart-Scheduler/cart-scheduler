import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function BackButton() {
  const { t } = useTranslation();
  return (
    <Link to="/signin" className="btn btn-light w-100">
      {t('Sign in again')}
    </Link>
  );
}
