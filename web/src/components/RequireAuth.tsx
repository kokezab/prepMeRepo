import { Spin } from 'antd';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useFirebaseUser } from '@/hooks/useFirebaseUser';

export default function RequireAuth() {
  const { user, loading } = useFirebaseUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="center-50vh">
        <Spin />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
