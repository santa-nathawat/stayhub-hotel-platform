import type { RoomType } from '../../types';
import { formatCurrency } from '../../lib/utils';
import Button from '../ui/Button';

interface RoomCardProps {
  room: RoomType;
  onSelect: (room: RoomType) => void;
}

const bedTypeLabels: Record<string, string> = {
  KING: 'King Bed',
  QUEEN: 'Queen Bed',
  TWIN: 'Twin Beds',
  SINGLE: 'Single Bed',
};

export default function RoomCard({ room, onSelect }: RoomCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white border border-apple-border rounded-2xl hover:shadow-card-hover transition-shadow">
      {/* Room image */}
      <div className="w-full sm:w-48 h-36 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={room.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop'}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Room info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-apple-text mb-1">{room.name}</h3>
        <div className="flex flex-wrap gap-3 text-sm text-apple-text-secondary mb-2">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3" />
            </svg>
            {bedTypeLabels[room.bedType] || room.bedType}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Up to {room.maxGuests} guests
          </span>
          {room.size && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {room.size} m²
            </span>
          )}
        </div>

        {room.description && (
          <p className="text-sm text-apple-text-secondary mb-3 line-clamp-2">{room.description}</p>
        )}

        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {room.amenities.map(a => (
              <span key={a.id} className="text-xs bg-apple-bg px-2 py-0.5 rounded-md text-apple-text-secondary">
                {a.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-semibold text-apple-text">{formatCurrency(room.pricePerNight)}</span>
            <span className="text-sm text-apple-text-secondary"> /night</span>
          </div>
          <Button onClick={() => onSelect(room)}>Select Room</Button>
        </div>
      </div>
    </div>
  );
}
