import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHotelById, updateHotel } from '../../api/hotels';
import HotelForm from '../../components/partner/HotelForm';
import type { Hotel } from '../../types';

export default function EditHotelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getHotelById(id)
      .then(setHotel)
      .catch(() => navigate('/partner/hotels'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) {
    return <div className="animate-pulse h-64 bg-apple-border-light rounded-2xl" />;
  }

  if (!hotel) return null;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight text-apple-text mb-6">Edit Hotel</h1>
      <HotelForm
        initialData={{
          name: hotel.name,
          description: hotel.description,
          address: hotel.address,
          city: hotel.city,
          country: hotel.country,
          latitude: hotel.latitude ?? undefined,
          longitude: hotel.longitude ?? undefined,
          starRating: hotel.starRating,
          checkInTime: hotel.checkInTime,
          checkOutTime: hotel.checkOutTime,
          amenities: hotel.amenities.map(a => a.name),
          images: hotel.images.map(i => ({ url: i.url, alt: i.alt || undefined })),
        }}
        submitLabel="Save Changes"
        onSubmit={async (data) => {
          await updateHotel(hotel.id, data);
          navigate('/partner/hotels');
        }}
      />
    </div>
  );
}
