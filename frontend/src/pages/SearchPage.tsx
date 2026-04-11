import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import SearchFilters from '../components/search/SearchFilters';
import HotelCard from '../components/search/HotelCard';
import { HotelCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { searchHotels } from '../api/hotels';
import type { Hotel, Pagination } from '../types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const city = searchParams.get('city') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = Number(searchParams.get('guests')) || 2;

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [city, checkIn, checkOut, guests, minPrice, maxPrice, stars.length, amenities.length]);

  useEffect(() => {
    setLoading(true);
    searchHotels({
      city: city || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      guests: guests || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      stars: stars.length > 0 ? stars : undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
      page,
    })
      .then((data) => {
        setHotels(data.hotels);
        setPagination(data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [city, checkIn, checkOut, guests, minPrice, maxPrice, stars, amenities, page]);

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(0);
    setStars([]);
    setAmenities([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar compact defaultCity={city} defaultCheckIn={checkIn} defaultCheckOut={checkOut} defaultGuests={guests} />
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white border border-apple-border rounded-2xl p-5 sticky top-24">
            <SearchFilters
              minPrice={minPrice} maxPrice={maxPrice} stars={stars} amenities={amenities}
              onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice}
              onStarsChange={setStars} onAmenitiesChange={setAmenities}
              onReset={resetFilters}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-apple-text-secondary">
              {pagination ? `${pagination.total} hotels found` : 'Searching...'}
              {city && <> in <span className="font-medium text-apple-text">{city}</span></>}
            </p>
            <button
              className="lg:hidden text-sm text-apple-blue font-medium"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden bg-white border border-apple-border rounded-2xl p-5 mb-4">
              <SearchFilters
                minPrice={minPrice} maxPrice={maxPrice} stars={stars} amenities={amenities}
                onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice}
                onStarsChange={setStars} onAmenitiesChange={setAmenities}
                onReset={resetFilters}
              />
            </div>
          )}

          {/* Hotel Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }, (_, i) => <HotelCardSkeleton key={i} />)
              : hotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)
            }
          </div>

          {!loading && hotels.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium text-apple-text mb-2">No hotels found</h3>
              <p className="text-sm text-apple-text-secondary">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-apple-text-secondary px-4">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
