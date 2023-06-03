import { appleSignIn } from '../../services/auth';
import AppleSignInButton from '../../components/AppleSignInButton';

// https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple#sign-in-with-apple-buttons
export default function AppleSignIn({ className }) {
  const handleClick = async () => {
    try {
      await appleSignIn();
    } catch (err) {
      console.error(err);
    }
  };
  return <AppleSignInButton onClick={handleClick} />;
}
