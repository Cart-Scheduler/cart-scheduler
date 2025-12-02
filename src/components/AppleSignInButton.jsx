import { useTranslation } from 'react-i18next';
import { FaApple } from 'react-icons/fa';

export default function AppleSignInButton({ white, className, onClick }) {
  const { t } = useTranslation();
  const style = {
    backgroundColor: white ? 'white' : 'black',
    color: white ? 'black' : 'white',
  };
  const iconStyle = {
    top: '1.2px',
  };
  return (
    <button
      className="d-flex btn w-100 p-3 align-items-center justify-content-center"
      style={style}
      onClick={onClick}
    >
      <div className="d-flex justify-content-center">
        <FaApple className="position-relative" style={iconStyle} size={16} />
        <span className="ms-1">{t('Sign in with Apple')}</span>
      </div>
    </button>
  );
}
