import GoogleButton from 'react-google-button';
import { useTranslation } from 'react-i18next';

import { googleSignIn } from '../../services/auth';

// Button that follows Google's style guidelines
export default function GoogleSignIn({ className }) {
  const { t } = useTranslation();
  const handleClick = async () => {
    try {
      googleSignIn();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <GoogleButton
      label={t('Sign in with Google')}
      onClick={handleClick}
      className={className}
    />
  );
}
