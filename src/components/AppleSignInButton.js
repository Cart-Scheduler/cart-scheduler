import { useTranslation } from 'react-i18next';
import { FaApple } from 'react-icons/fa';

export default function AppleSignInButton({ white, className, onClick }) {
  const { t } = useTranslation();
  const style = {
    backgroundColor: white ? 'white' : 'black',
    color: white ? 'black' : 'white',
  };
  return (
    <button className="btn w-100 p-3" style={style} onClick={onClick}>
      <FaApple /> {t('Sign in with Apple')}
    </button>
  );
}
