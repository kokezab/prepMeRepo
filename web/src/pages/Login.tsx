// @ts-nocheck

import { Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import GoogleLoginButton from "@/components/GoogleLoginButton.tsx";
import { upsertUser } from '@/features/users/api/usersApi';
import { useAppDispatch } from '@/redux/hooks';
import { disableGuestMode } from '@/redux/uiSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const u = cred.user;
      if (u?.uid) {
        await upsertUser(u.uid, {
          name: u.displayName ?? null,
          email: u.email ?? null,
          photoURL: u.photoURL ?? null,
        });
      }
      // Ensure we leave guest mode after real login
      dispatch(disableGuestMode());
      navigate('/auth/categories', { replace: true });
    } catch (err: any) {
      // Show a friendly message
      message.error(err?.message ?? 'Google sign-in failed');
    }
  };

  return (
    <div
      className="center-100vh animated-gradient"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="text-center glass fade-in"
        style={{
          padding: '48px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          maxWidth: '400px',
          width: '90%'
        }}
      >
        <Typography.Title
          level={2}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '36px',
            fontWeight: 700,
            marginBottom: '8px'
          }}
        >
          Welcome to PrepMe
        </Typography.Title>
        <Typography.Paragraph
          style={{
            color: '#4b5563',
            fontSize: '16px',
            marginBottom: '32px'
          }}
        >
          Sign in to continue learning
        </Typography.Paragraph>
        <GoogleLoginButton onClick={handleLogin}>
          Continue with Google
        </GoogleLoginButton>
      </div>
    </div>
  );
}
