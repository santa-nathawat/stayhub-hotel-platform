import type { HotelAmenity } from '../../types';

const amenityIcons: Record<string, string> = {
  WiFi: '📶', Pool: '🏊', Gym: '🏋️', Spa: '💆', Parking: '🅿️',
  Restaurant: '🍽️', Bar: '🍸', 'Room Service': '🛎️', 'Airport Shuttle': '🚐',
  'Pet Friendly': '🐾', 'Air Conditioning': '❄️', Laundry: '👔',
  'Business Center': '💼', 'Beach Access': '🏖️', 'Hot Tub': '♨️', Kitchen: '🍳',
};

interface AmenityListProps {
  amenities: HotelAmenity[];
}

export default function AmenityList({ amenities }: AmenityListProps) {
  if (!amenities?.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {amenities.map(amenity => (
        <div key={amenity.id} className="flex items-center gap-2 px-3 py-2 bg-apple-bg rounded-xl">
          <span className="text-base">{amenityIcons[amenity.name] || '✨'}</span>
          <span className="text-sm text-apple-text">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
}
