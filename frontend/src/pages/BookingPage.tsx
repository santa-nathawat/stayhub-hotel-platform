import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../api/hotels';
import { createBooking } from '../api/bookings';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatCurrency, formatDate } from '../lib/utils';
import { differenceInDays, format } from 'date-fns';
import type { Hotel, RoomType } from '../types';

type Step = 'details' | 'payment' | 'confirmation';

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const roomTypeId = searchParams.get('roomTypeId') || '';
  const checkInParam = searchParams.get('checkIn') || format(new Date(), 'yyyy-MM-dd');
  const checkOutParam = searchParams.get('checkOut') || format(new Date(Date.now() + 86400000), 'yyyy-MM-dd');
  const guestsParam = Number(searchParams.get('guests')) || 2;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('details');
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  const [checkIn, setCheckIn] = useState(checkInParam);
  const [checkOut, setCheckOut] = useState(checkOutParam);
  const [guests, setGuests] = useState(guestsParam);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  const nights = differenceInDays(new Date(checkOut), new Date(checkIn));
  const totalPrice = room ? room.pricePerNight * Math.max(nights, 0) : 0;

  useEffect(() => {
    if (!id) return;
    getHotelById(id)
      .then(h => {
        setHotel(h);
        const r = h.rooms?.find(r => r.id === roomTypeId) || h.rooms?.[0];
        setRoom(r || null);
      })
      .catch(() => navigate('/search'))
      .finally(() => setLoading(false));
  }, [id, roomTypeId, navigate]);

  const handleSubmit = async () => {
    if (!room || !hotel || nights <= 0) return;
    setSubmitting(true);
    setError('');
    try {
      const booking = await createBooking({
        hotelId: hotel.id,
        roomTypeId: room.id,
        checkIn,
        checkOut,
        guests,
        guestName,
        guestEmail,
        guestPhone: guestPhone || undefined,
        specialRequests: specialRequests || undefined,
      });
      setBookingId(booking.id);
      setStep('confirmation');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-apple-border-light rounded w-1/3" />
          <div className="h-64 bg-apple-border-light rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-apple-text">Room not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Steps indicator */}
      <div className="flex items-center gap-4 mb-8">
        {['Guest Details', 'Payment', 'Confirmation'].map((s, i) => {
          const steps: Step[] = ['details', 'payment', 'confirmation'];
          const isActive = steps.indexOf(step) >= i;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${isActive ? 'bg-apple-blue text-white' : 'bg-apple-border-light text-apple-text-secondary'}`}>
                {i + 1}
              </div>
              <span className={`text-sm ${isActive ? 'text-apple-text font-medium' : 'text-apple-text-secondary'}`}>{s}</span>
              {i < 2 && <div className="w-8 h-px bg-apple-border mx-1" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 'details' && (
            <div className="bg-white border border-apple-border rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-apple-text">Guest Information</h2>

              {error && (
                <div className="bg-red-50 text-apple-error text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="checkIn" type="date" label="Check-in" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
                <Input id="checkOut" type="date" label="Check-out" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium text-apple-text mb-1.5">Guests</label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20"
                >
                  {Array.from({ length: room.maxGuests }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <Input id="guestName" label="Full Name" value={guestName} onChange={e => setGuestName(e.target.value)} required />
              <Input id="guestEmail" type="email" label="Email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} required />
              <Input id="guestPhone" type="tel" label="Phone (optional)" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />

              <div>
                <label className="block text-sm font-medium text-apple-text mb-1.5">Special Requests (optional)</label>
                <textarea
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 resize-none"
                  placeholder="Any special requests..."
                />
              </div>

              <Button
                size="lg"
                className="w-full"
                disabled={!guestName || !guestEmail || nights <= 0}
                onClick={() => setStep('payment')}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white border border-apple-border rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-apple-text">Payment Details</h2>
              <p className="text-sm text-apple-text-secondary">This is a demo - no real payment will be processed.</p>

              <div className="bg-apple-bg border border-apple-border rounded-xl p-5 space-y-4">
                <Input id="cardNumber" label="Card Number" placeholder="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-4">
                  <Input id="expiry" label="Expiry" placeholder="MM/YY" />
                  <Input id="cvv" label="CVV" placeholder="123" />
                </div>
                <Input id="cardName" label="Name on Card" placeholder="John Doe" />
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="lg" onClick={() => setStep('details')}>
                  Back
                </Button>
                <Button size="lg" className="flex-1" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Processing...' : `Pay ${formatCurrency(totalPrice)}`}
                </Button>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="bg-white border border-apple-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-apple-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-apple-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-apple-text mb-2">Booking Confirmed!</h2>
              <p className="text-apple-text-secondary mb-1">Your booking reference</p>
              <p className="text-lg font-mono font-medium text-apple-blue mb-6">{bookingId.slice(0, 12).toUpperCase()}</p>
              <p className="text-sm text-apple-text-secondary mb-6">
                A confirmation email has been sent to {guestEmail}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate(`/bookings/${bookingId}`)}>
                  View Booking
                </Button>
                <Button variant="secondary" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div>
          <div className="bg-white border border-apple-border rounded-2xl p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-apple-text mb-4">Booking Summary</h3>

            <div className="flex gap-3 mb-4">
              <img
                src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'}
                alt={hotel.name}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm font-medium text-apple-text">{hotel.name}</p>
                <p className="text-xs text-apple-text-secondary">{hotel.city}, {hotel.country}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm border-t border-apple-border-light pt-4">
              <div className="flex justify-between">
                <span className="text-apple-text-secondary">Room</span>
                <span className="text-apple-text font-medium">{room.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-text-secondary">Check-in</span>
                <span className="text-apple-text">{formatDate(checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-text-secondary">Check-out</span>
                <span className="text-apple-text">{formatDate(checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-text-secondary">Nights</span>
                <span className="text-apple-text">{Math.max(nights, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-apple-text-secondary">Guests</span>
                <span className="text-apple-text">{guests}</span>
              </div>
            </div>

            <div className="border-t border-apple-border-light mt-4 pt-4">
              <div className="flex justify-between">
                <span className="text-apple-text-secondary text-sm">
                  {formatCurrency(room.pricePerNight)} x {Math.max(nights, 0)} nights
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-base font-semibold text-apple-text">Total</span>
                <span className="text-xl font-semibold text-apple-text">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
