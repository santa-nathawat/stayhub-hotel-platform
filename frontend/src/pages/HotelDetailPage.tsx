import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById } from '../api/hotels';
import type { Hotel, RoomType } from '../types';
import PhotoGallery from '../components/hotel/PhotoGallery';
import RoomCard from '../components/hotel/RoomCard';
import AmenityList from '../components/hotel/AmenityList';
import ReviewList from '../components/hotel/ReviewList';
import HotelMap from '../components/hotel/HotelMap';
import StarRating from '../components/ui/StarRating';
import Skeleton from '../components/ui/Skeleton';

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getHotelById(id)
      .then(setHotel)
      .catch(() => navigate('/search'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSelectRoom = (room: RoomType) => {
    navigate(`/hotels/${id}/book?roomTypeId=${room.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-[400px] rounded-2xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-apple-text">Hotel not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Photo Gallery */}
      <PhotoGallery images={hotel.images} hotelName={hotel.name} />

      {/* Hotel Info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold tracking-tight text-apple-text">{hotel.name}</h1>
              <StarRating rating={hotel.starRating} size="md" />
            </div>
            <p className="text-apple-text-secondary flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hotel.address}, {hotel.city}, {hotel.country}
            </p>
            {hotel.avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-apple-blue text-white text-sm font-semibold px-2.5 py-0.5 rounded-lg">
                  {hotel.avgRating}
                </span>
                <span className="text-sm text-apple-text-secondary">
                  {hotel.reviewCount} {hotel.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-apple-text mb-3">About this hotel</h2>
            <p className="text-apple-text-secondary leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          {hotel.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-apple-text mb-3">Amenities</h2>
              <AmenityList amenities={hotel.amenities} />
            </div>
          )}

          {/* Rooms */}
          <div>
            <h2 className="text-lg font-semibold text-apple-text mb-4">Available Rooms</h2>
            <div className="space-y-4">
              {hotel.rooms?.map(room => (
                <RoomCard key={room.id} room={room} onSelect={handleSelectRoom} />
              ))}
              {(!hotel.rooms || hotel.rooms.length === 0) && (
                <p className="text-apple-text-secondary text-sm">No rooms available at the moment.</p>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-semibold text-apple-text mb-4">Guest Reviews</h2>
            <ReviewList hotelId={hotel.id} avgRating={hotel.avgRating} reviewCount={hotel.reviewCount} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Check-in/out times */}
          <div className="bg-white border border-apple-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-apple-text mb-4">Hotel Policies</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-apple-text-secondary">Check-in</span>
                <span className="font-medium text-apple-text">{hotel.checkInTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-apple-text-secondary">Check-out</span>
                <span className="font-medium text-apple-text">{hotel.checkOutTime}</span>
              </div>
            </div>
          </div>

          {/* Map */}
          {hotel.latitude && hotel.longitude && (
            <div>
              <h3 className="text-sm font-semibold text-apple-text mb-3">Location</h3>
              <HotelMap latitude={hotel.latitude} longitude={hotel.longitude} name={hotel.name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
