import { cn } from '../../lib/utils';
import { AMENITIES } from '../../lib/constants';
import StarRating from '../ui/StarRating';

interface SearchFiltersProps {
  minPrice: number;
  maxPrice: number;
  stars: number[];
  amenities: string[];
  onMinPriceChange: (v: number) => void;
  onMaxPriceChange: (v: number) => void;
  onStarsChange: (v: number[]) => void;
  onAmenitiesChange: (v: string[]) => void;
  onReset: () => void;
}

export default function SearchFilters({
  minPrice, maxPrice, stars, amenities,
  onMinPriceChange, onMaxPriceChange, onStarsChange, onAmenitiesChange, onReset,
}: SearchFiltersProps) {
  const toggleStar = (star: number) => {
    onStarsChange(stars.includes(star) ? stars.filter(s => s !== star) : [...stars, star]);
  };

  const toggleAmenity = (amenity: string) => {
    onAmenitiesChange(amenities.includes(amenity) ? amenities.filter(a => a !== amenity) : [...amenities, amenity]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-apple-text">Filters</h3>
        <button onClick={onReset} className="text-xs text-apple-blue hover:underline">
          Reset all
        </button>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-medium text-apple-text-secondary uppercase tracking-wider mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ''}
            onChange={(e) => onMinPriceChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-apple-bg border border-apple-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-apple-blue/20"
          />
          <span className="text-apple-text-secondary">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ''}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full px-3 py-2 bg-apple-bg border border-apple-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-apple-blue/20"
          />
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <h4 className="text-xs font-medium text-apple-text-secondary uppercase tracking-wider mb-3">Star Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(star => (
            <button
              key={star}
              onClick={() => toggleStar(star)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors',
                stars.includes(star) ? 'bg-apple-blue-light text-apple-blue' : 'hover:bg-gray-50 text-apple-text-secondary'
              )}
            >
              <StarRating rating={star} size="sm" />
              <span>{star} {star === 1 ? 'star' : 'stars'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-xs font-medium text-apple-text-secondary uppercase tracking-wider mb-3">Amenities</h4>
        <div className="space-y-1">
          {AMENITIES.map(amenity => (
            <label
              key={amenity}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="w-4 h-4 rounded border-apple-border text-apple-blue focus:ring-apple-blue/20"
              />
              <span className="text-sm text-apple-text">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
