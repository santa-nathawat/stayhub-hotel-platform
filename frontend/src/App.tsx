import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import GuestLayout from './components/layout/GuestLayout';
import PartnerLayout from './components/layout/PartnerLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import HotelDetailPage from './pages/HotelDetailPage';
import BookingPage from './pages/BookingPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import DashboardPage from './pages/partner/DashboardPage';
import MyHotelsPage from './pages/partner/MyHotelsPage';
import CreateHotelPage from './pages/partner/CreateHotelPage';
import EditHotelPage from './pages/partner/EditHotelPage';
import RoomManagementPage from './pages/partner/RoomManagementPage';
import HotelBookingsPage from './pages/partner/HotelBookingsPage';
import SettingsPage from './pages/partner/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Guest Routes */}
          <Route element={<GuestLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotels/:id" element={<HotelDetailPage />} />
            <Route path="/hotels/:id/book" element={
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute><BookingsPage /></ProtectedRoute>
            } />
            <Route path="/bookings/:id" element={
              <ProtectedRoute><BookingDetailPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Partner Routes */}
          <Route element={<PartnerLayout />}>
            <Route path="/partner/dashboard" element={<DashboardPage />} />
            <Route path="/partner/hotels" element={<MyHotelsPage />} />
            <Route path="/partner/hotels/new" element={<CreateHotelPage />} />
            <Route path="/partner/hotels/:id/edit" element={<EditHotelPage />} />
            <Route path="/partner/hotels/:id/rooms" element={<RoomManagementPage />} />
            <Route path="/partner/hotels/:id/bookings" element={<HotelBookingsPage />} />
            <Route path="/partner/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
