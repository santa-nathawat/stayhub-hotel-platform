import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

interface SearchBarProps {
  compact?: boolean;
  defaultCity?: string;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: number;
}

export default function SearchBar({ compact, defaultCity = '', defaultCheckIn = '', defaultCheckOut = '', defaultGuests = 2 }: SearchBarProps) {
  const navigate = useNavigate();
  const [city, setCity] = useState(defaultCity);
  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(defaultGuests);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="bg-white border border-apple-border rounded-2xl shadow-card overflow-hidden">
        {/* Mobile: stacked layout */}
        <div className="flex flex-col sm:hidden divide-y divide-apple-border">
          <input
            type="text"
            placeholder="Where to?"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 text-sm outline-none bg-transparent placeholder:text-apple-text-secondary/50 w-full"
          />
          <div className="grid grid-cols-2 divide-x divide-apple-border">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="px-4 py-3 text-sm outline-none bg-transparent text-apple-text w-full min-w-0"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="px-4 py-3 text-sm outline-none bg-transparent text-apple-text w-full min-w-0"
            />
          </div>
          <div className="px-4 py-3">
            <Button type="submit" size="sm" className="w-full">Search</Button>
          </div>
        </div>

        {/* Desktop: pill-style horizontal layout */}
        <div className="hidden sm:flex items-center divide-x divide-apple-border rounded-2xl overflow-hidden">
          <input
            type="text"
            placeholder="Where to?"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 text-sm outline-none bg-transparent placeholder:text-apple-text-secondary/50 min-w-0"
          />
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="px-4 py-3 text-sm outline-none bg-transparent text-apple-text-secondary w-36 flex-shrink-0"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="px-4 py-3 text-sm outline-none bg-transparent text-apple-text-secondary w-36 flex-shrink-0"
          />
          <div className="px-3 py-2 flex-shrink-0">
            <Button type="submit" size="sm">Search</Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-card-hover border border-apple-border p-4 sm:p-6 overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="col-span-2 md:col-span-1 space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Destination</label>
          <input
            type="text"
            placeholder="City or hotel name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 sm:px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all placeholder:text-apple-text-secondary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full min-w-0 px-2 sm:px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all text-apple-text"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full min-w-0 px-2 sm:px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all text-apple-text"
          />
        </div>

        <div className="col-span-2 md:col-span-1 space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Guests</label>
          <div className="flex gap-2">
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="flex-1 min-w-0 px-3 sm:px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all text-apple-text"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
            <Button type="submit" size="lg" className="px-6 sm:px-8 flex-shrink-0">
              Search
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
