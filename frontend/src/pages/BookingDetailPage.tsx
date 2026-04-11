import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, cancelBooking } from '../api/bookings';
import type { Booking } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatCurrency, formatDate } from '../lib/utils';
import { BOOKING_STATUSES } from '../lib/constants';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBookingById(id)
      .then(setBooking)
      .catch(() => navigate('/bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    if (!booking || !confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(true);
    try {
      const updated = await cancelBooking(booking.id);
      setBooking({ ...booking, status: updated.status });
    } catch {
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-apple-border-light rounded w-1/3" />
          <div className="h-64 bg-apple-border-light rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const statusConfig = BOOKING_STATUSES[booking.status];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate('/bookings')} className="text-sm text-apple-blue hover:underline mb-4 inline-flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to bookings
      </button>

      <div className="bg-white border border-apple-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-apple-border-light">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-apple-text mb-1">Booking Details</h1>
              <p className="text-sm text-apple-text-secondary font-mono">{booking.id.slice(0, 12).toUpperCase()}</p>
            </div>
            <Badge variant={statusConfig.color as any}>{statusConfig.label}</Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Hotel info */}
          <div className="flex gap-4">
            <img
              src={booking.hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'}
              alt={booking.hotel.name}
              className="w-24 h-20 object-cover rounded-xl"
            />
            <div>
              <h2 className="font-semibold text-apple-text">{booking.hotel.name}</h2>
              <p className="text-sm text-apple-text-secondary">{booking.hotel.city}, {booking.hotel.country}</p>
              <p className="text-sm text-apple-text-secondary">{booking.roomType.name}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-apple-bg rounded-xl p-4">
              <p className="text-xs text-apple-text-secondary uppercase tracking-wider mb-1">Check-in</p>
              <p className="text-sm font-medium text-apple-text">{formatDate(booking.checkIn)}</p>
              {booking.hotel.checkInTime && <p className="text-xs text-apple-text-secondary mt-0.5">{booking.hotel.checkInTime}</p>}
            </div>
            <div className="bg-apple-bg rounded-xl p-4">
              <p className="text-xs text-apple-text-secondary uppercase tracking-wider mb-1">Check-out</p>
              <p className="text-sm font-medium text-apple-text">{formatDate(booking.checkOut)}</p>
              {booking.hotel.checkOutTime && <p className="text-xs text-apple-text-secondary mt-0.5">{booking.hotel.checkOutTime}</p>}
            </div>
            <div className="bg-apple-bg rounded-xl p-4">
              <p className="text-xs text-apple-text-secondary uppercase tracking-wider mb-1">Nights</p>
              <p className="text-sm font-medium text-apple-text">{booking.nights}</p>
            </div>
            <div className="bg-apple-bg rounded-xl p-4">
              <p className="text-xs text-apple-text-secondary uppercase tracking-wider mb-1">Guests</p>
              <p className="text-sm font-medium text-apple-text">{booking.guests}</p>
            </div>
          </div>

          {/* Guest info */}
          <div>
            <h3 className="text-sm font-semibold text-apple-text mb-3">Guest Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-apple-text-secondary">Name</span><span className="text-apple-text">{booking.guestName}</span></div>
              <div className="flex justify-between"><span className="text-apple-text-secondary">Email</span><span className="text-apple-text">{booking.guestEmail}</span></div>
              {booking.guestPhone && <div className="flex justify-between"><span className="text-apple-text-secondary">Phone</span><span className="text-apple-text">{booking.guestPhone}</span></div>}
              {booking.specialRequests && <div><span className="text-apple-text-secondary">Special Requests</span><p className="text-apple-text mt-1">{booking.specialRequests}</p></div>}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-apple-border-light pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-apple-text">Total</span>
              <span className="text-2xl font-semibold text-apple-text">{formatCurrency(booking.totalPrice)}</span>
            </div>
          </div>

          {/* Actions */}
          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
            <div className="pt-2">
              <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
