import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyHotels, togglePublish, deleteHotel } from '../../api/hotels';
import type { Hotel } from '../../types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StarRating from '../../components/ui/StarRating';

export default function MyHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyHotels()
      .then(setHotels)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await togglePublish(id);
      setHotels(prev => prev.map(h => h.id === id ? { ...h, published: updated.published } : h));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    try {
      await deleteHotel(id);
      setHotels(prev => prev.filter(h => h.id !== id));
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-apple-text">My Hotels</h1>
        <div className="grid gap-4">
          {[1, 2].map(i => <div key={i} className="animate-pulse bg-apple-border-light rounded-2xl h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-apple-text">My Hotels</h1>
        <Link to="/partner/hotels/new">
          <Button>+ Add Hotel</Button>
        </Link>
      </div>

      {hotels.length === 0 ? (
        <div className="text-center py-16 bg-white border border-apple-border rounded-2xl">
          <h3 className="text-lg font-medium text-apple-text mb-2">No hotels yet</h3>
          <p className="text-sm text-apple-text-secondary mb-4">Create your first hotel listing</p>
          <Link to="/partner/hotels/new"><Button>Add Hotel</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {hotels.map(hotel => (
            <div key={hotel.id} className="bg-white border border-apple-border rounded-2xl p-5 flex gap-4">
              <img
                src={hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'}
                alt={hotel.name}
                className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-apple-text">{hotel.name}</h3>
                    <p className="text-sm text-apple-text-secondary">{hotel.city}, {hotel.country}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={hotel.starRating} size="sm" />
                      <Badge variant={hotel.published ? 'success' : 'warning'}>
                        {hotel.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-xs text-apple-text-secondary">
                    <p>{hotel._count?.rooms || 0} rooms</p>
                    <p>{hotel._count?.bookings || 0} bookings</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link to={`/partner/hotels/${hotel.id}/edit`}><Button variant="secondary" size="sm">Edit</Button></Link>
                  <Link to={`/partner/hotels/${hotel.id}/rooms`}><Button variant="secondary" size="sm">Rooms</Button></Link>
                  <Link to={`/partner/hotels/${hotel.id}/bookings`}><Button variant="secondary" size="sm">Bookings</Button></Link>
                  <Button variant="ghost" size="sm" onClick={() => handleTogglePublish(hotel.id)}>
                    {hotel.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-apple-error" onClick={() => handleDelete(hotel.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
