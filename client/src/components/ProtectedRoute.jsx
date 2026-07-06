import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from './Loading';
export default function ProtectedRoute({ admin = false }) {
  const { user, loading } = useAuth(); const location = useLocation();
  if (loading) return <PageLoader/>;
  if (!user) return <Navigate to={admin ? '/admin' : '/login'} state={{ from: location }} replace/>;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace/>;
  return <Outlet/>;
}
