import { Link } from 'react-router-dom';
import type { Hotel } from '../../types';
import { formatCurrency } from '../../lib/utils';
import StarRating from '../ui/StarRating';

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const imageUrl = hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop';

  return (
    <Link to={`/hotels/${hotel.id}`} className="group block">
      <div className="bg-apple-card border border-apple-border rounded-2xl overflow-hidden shadow-card transition-all duration-200 group-hover:shadow-card-hover group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2.5 py-1 rounded-full text-apple-text">
              {hotel.city}, {hotel.country}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-apple-text line-clamp-1 group-hover:text-apple-blue transition-colors">
              {hotel.name}
            </h3>
            <StarRating rating={hotel.starRating} size="sm" />
          </div>

          <p className="text-sm text-apple-text-secondary line-clamp-2 mb-3">
            {hotel.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {hotel.avgRating > 0 && (
                <>
                  <span className="bg-apple-blue text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                    {hotel.avgRating}
                  </span>
                  <span className="text-xs text-apple-text-secondary">
                    ({hotel.reviewCount} {hotel.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </>
              )}
            </div>

            <div className="text-right">
              {hotel.startingPrice ? (
                <>
                  <span className="text-lg font-semibold text-apple-text">
                    {formatCurrency(hotel.startingPrice)}
                  </span>
                  <span className="text-xs text-apple-text-secondary"> /night</span>
                </>
              ) : (
                <span className="text-sm text-apple-text-secondary">Price on request</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
