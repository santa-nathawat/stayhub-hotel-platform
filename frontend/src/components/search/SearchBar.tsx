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
      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white border border-apple-border rounded-full px-4 py-2 shadow-card">
        <input
          type="text"
          placeholder="Where to?"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 text-sm outline-none bg-transparent placeholder:text-apple-text-secondary/50 min-w-0"
        />
        <div className="w-px h-6 bg-apple-border" />
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="text-sm outline-none bg-transparent text-apple-text-secondary w-32" />
        <div className="w-px h-6 bg-apple-border" />
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="text-sm outline-none bg-transparent text-apple-text-secondary w-32" />
        <Button type="submit" size="sm">Search</Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-card-hover border border-apple-border p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Destination</label>
          <input
            type="text"
            placeholder="City or hotel name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all placeholder:text-apple-text-secondary/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all text-apple-text"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all text-apple-text"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-apple-text-secondary uppercase tracking-wider">Guests</label>
          <div className="flex gap-2">
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="flex-1 px-4 py-3 bg-apple-bg border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all text-apple-text"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
            <Button type="submit" size="lg" className="px-8">
              Search
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
