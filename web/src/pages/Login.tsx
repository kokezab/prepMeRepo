// @ts-nocheck

import { Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import GoogleLoginButton from "@/components/GoogleLoginButton.tsx";
import { upsertUser } from '@/features/users/api/usersApi';

export default function Login() {
  const navigate = useNavigate();

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
      navigate('/categories', { replace: true });
    } catch (err: any) {
      // Show a friendly message
      message.error(err?.message ?? 'Google sign-in failed');
    }
  };

  return (
    <div className="center-100vh">
      <div className="text-center">
        <Typography.Title level={2}>Login</Typography.Title>
        <GoogleLoginButton onClick={handleLogin}>
          Continue with Google
        </GoogleLoginButton>
      </div>
    </div>
  );
}
