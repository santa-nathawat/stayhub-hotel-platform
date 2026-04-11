import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import HotelCard from '../components/search/HotelCard';
import { HotelCardSkeleton } from '../components/ui/Skeleton';
import { getFeaturedHotels } from '../api/hotels';
import type { Hotel } from '../types';

export default function HomePage() {
  const [featured, setFeatured] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedHotels()
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=800&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h1 className="text-4xl lg:text-6xl font-semibold tracking-tight mb-4">
              Find your perfect stay
            </h1>
            <p className="text-lg text-gray-300">
              Discover and book hotels worldwide at the best prices
            </p>
          </div>
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-apple-text">Featured Hotels</h2>
            <p className="text-sm text-apple-text-secondary mt-1">Handpicked destinations for your next trip</p>
          </div>
          <Link to="/search" className="text-sm font-medium text-apple-blue hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }, (_, i) => <HotelCardSkeleton key={i} />)
            : featured.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)
          }
        </div>

        {!loading && featured.length === 0 && (
          <div className="text-center py-16">
            <p className="text-apple-text-secondary">No hotels available yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-white border-t border-apple-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-apple-text mb-3">
              List your property on StayHub
            </h2>
            <p className="text-apple-text-secondary mb-6">
              Reach millions of travelers worldwide and grow your business
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-apple-blue text-white rounded-full font-medium hover:bg-apple-blue-hover transition-colors"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
