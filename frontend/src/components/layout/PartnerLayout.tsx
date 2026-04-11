import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import PartnerSidebar from './PartnerSidebar';

export default function PartnerLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-bg">
        <div className="animate-spin w-8 h-8 border-2 border-apple-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== 'PARTNER') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-apple-bg">
      <Header />
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <PartnerSidebar />
        </div>
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
