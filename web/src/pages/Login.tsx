import { Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
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
        <Button type="primary" size="large" onClick={handleLogin}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
