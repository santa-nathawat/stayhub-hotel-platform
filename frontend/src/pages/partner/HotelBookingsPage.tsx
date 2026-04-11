import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getHotelBookings, confirmBooking, cancelBooking } from '../../api/bookings';
import type { Booking } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { BOOKING_STATUSES } from '../../lib/constants';

export default function HotelBookingsPage() {
  const { id: hotelId } = useParams<{ id: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hotelId) return;
    getHotelBookings(hotelId)
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hotelId]);

  const handleConfirm = async (bookingId: string) => {
    try {
      await confirmBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' as const } : b));
    } catch {}
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b));
    } catch {}
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-apple-border-light rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-apple-text">Hotel Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white border border-apple-border rounded-2xl">
          <p className="text-apple-text-secondary">No bookings yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-apple-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-apple-border-light bg-apple-bg">
                  <th className="text-left px-4 py-3 font-medium text-apple-text-secondary">Guest</th>
                  <th className="text-left px-4 py-3 font-medium text-apple-text-secondary">Room</th>
                  <th className="text-left px-4 py-3 font-medium text-apple-text-secondary">Dates</th>
                  <th className="text-left px-4 py-3 font-medium text-apple-text-secondary">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-apple-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-apple-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => {
                  const statusConfig = BOOKING_STATUSES[booking.status];
                  return (
                    <tr key={booking.id} className="border-b border-apple-border-light last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-apple-text">{booking.user?.name || booking.guestName}</p>
                        <p className="text-xs text-apple-text-secondary">{booking.user?.email || booking.guestEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-apple-text">{booking.roomType.name}</td>
                      <td className="px-4 py-3 text-apple-text-secondary">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        <br /><span className="text-xs">{booking.nights} nights, {booking.guests} guests</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-apple-text">{formatCurrency(booking.totalPrice)}</td>
                      <td className="px-4 py-3"><Badge variant={statusConfig.color as any}>{statusConfig.label}</Badge></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {booking.status === 'PENDING' && (
                            <Button size="sm" onClick={() => handleConfirm(booking.id)}>Confirm</Button>
                          )}
                          {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                            <Button variant="ghost" size="sm" className="text-apple-error" onClick={() => handleCancel(booking.id)}>Cancel</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
