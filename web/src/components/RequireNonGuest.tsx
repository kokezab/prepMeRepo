import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';

export default function RequireNonGuest() {
  const guestMode = useAppSelector((s) => s.ui.guestMode);
  if (guestMode) return <Navigate to="/questions" replace />;
  return <Outlet />;
}
