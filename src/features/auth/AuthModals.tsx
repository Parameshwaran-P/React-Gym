import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './SignUp';
import { ForgotPassword } from './ForgotModal';

type ModalType = 'login' | 'signup' | 'forgotPassword' | null;

interface AuthModalsProps {
  initialModal?: ModalType;
  onClose?: () => void;
}

/**
 * AuthModals - Main controller component for authentication modals
 * 
 * Usage:
 * 
 * // In your component
 * const [authModal, setAuthModal] = useState<'login' | 'signup' | 'forgotPassword' | null>(null);
 * 
 * // Render
 * {authModal && (
 *   <AuthModals 
 *     initialModal={authModal} 
 *     onClose={() => setAuthModal(null)} 
 *   />
 * )}
 * 
 * // Trigger from anywhere
 * <button onClick={() => setAuthModal('login')}>Login</button>
 * <button onClick={() => setAuthModal('signup')}>Sign Up</button>
 */
export function AuthModals({ initialModal = 'login', onClose }: AuthModalsProps) {
  const [currentModal, setCurrentModal] = useState<ModalType>(initialModal);

  const handleClose = () => {
    setCurrentModal(null);
    onClose?.();
  };

  const switchToLogin = () => setCurrentModal('login');
  const switchToSignup = () => setCurrentModal('signup');
  const switchToForgotPassword = () => setCurrentModal('forgotPassword');

  if (!currentModal) return null;

  return (
    <>
      {currentModal === 'login' && (
        <Login
          onClose={handleClose}
          onSwitchToSignup={switchToSignup}
          onSwitchToForgotPassword={switchToForgotPassword}
        />
      )}

      {currentModal === 'signup' && (
        <Signup
          onClose={handleClose}
          onSwitchToLogin={switchToLogin}
        />
      )}

      {currentModal === 'forgotPassword' && (
        <ForgotPassword
          onClose={handleClose}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
}

// Export hook for easier usage
export function useAuthModals() {
  const [modal, setModal] = useState<ModalType>(null);

  return {
    modal,
    openLogin: () => setModal('login'),
    openSignup: () => setModal('signup'),
    openForgotPassword: () => setModal('forgotPassword'),
    close: () => setModal(null),
  };
}