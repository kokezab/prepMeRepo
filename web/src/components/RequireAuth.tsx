import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';
import { useAppSelector } from '@/redux/hooks';

export default function RequireAuth() {
  const { user, loading } = useFirebaseUser();
  const location = useLocation();
  const guestMode = useAppSelector((s) => s.ui.guestMode);

  if (loading) {
    return (
      <div className="center-50vh">
        <Spin />
      </div>
    );
  }

  if (!user && !guestMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
