import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../api/bookings';
import type { Booking } from '../types';
import Badge from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../lib/utils';
import { BOOKING_STATUSES } from '../lib/constants';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-apple-text mb-6">My Bookings</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-apple-border-light rounded-2xl h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-apple-text mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-apple-text mb-2">No bookings yet</h3>
          <p className="text-sm text-apple-text-secondary mb-4">Start exploring hotels and make your first booking!</p>
          <Link
            to="/search"
            className="inline-flex items-center px-6 py-2.5 bg-apple-blue text-white rounded-full text-sm font-medium hover:bg-apple-blue-hover"
          >
            Explore Hotels
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const statusConfig = BOOKING_STATUSES[booking.status];
            return (
              <Link
                key={booking.id}
                to={`/bookings/${booking.id}`}
                className="block bg-white border border-apple-border rounded-2xl p-5 hover:shadow-card-hover transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={booking.hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'}
                    alt={booking.hotel.name}
                    className="w-24 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-apple-text">{booking.hotel.name}</h3>
                        <p className="text-sm text-apple-text-secondary">{booking.hotel.city}, {booking.hotel.country}</p>
                      </div>
                      <Badge variant={statusConfig.color as any}>{statusConfig.label}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-apple-text-secondary">
                      <span>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                      <span>{booking.nights} nights</span>
                      <span className="font-medium text-apple-text">{formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
