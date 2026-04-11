import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomsByHotel, createRoom, updateRoom, deleteRoom } from '../../api/rooms';
import type { RoomType } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { BED_TYPES } from '../../lib/constants';
import { formatCurrency } from '../../lib/utils';

export default function RoomManagementPage() {
  const { id: hotelId } = useParams<{ id: string }>();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [bedType, setBedType] = useState('KING');
  const [maxGuests, setMaxGuests] = useState(2);
  const [size, setSize] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [totalRooms, setTotalRooms] = useState(1);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hotelId) return;
    getRoomsByHotel(hotelId)
      .then(setRooms)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hotelId]);

  const resetForm = () => {
    setName(''); setBedType('KING'); setMaxGuests(2); setSize('');
    setPricePerNight(''); setTotalRooms(1); setDescription(''); setImageUrl('');
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (room: RoomType) => {
    setEditingId(room.id); setName(room.name); setBedType(room.bedType);
    setMaxGuests(room.maxGuests); setSize(room.size?.toString() || '');
    setPricePerNight(room.pricePerNight.toString()); setTotalRooms(room.totalRooms);
    setDescription(room.description || ''); setImageUrl(room.imageUrl || '');
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId) return;
    setSaving(true);
    const data = {
      name, bedType, maxGuests, size: size ? parseInt(size) : undefined,
      pricePerNight: parseFloat(pricePerNight), totalRooms, description: description || undefined,
      imageUrl: imageUrl || undefined,
    };
    try {
      if (editingId) {
        const updated = await updateRoom(editingId, data);
        setRooms(prev => prev.map(r => r.id === editingId ? updated : r));
      } else {
        const created = await createRoom(hotelId, data);
        setRooms(prev => [...prev, created]);
      }
      resetForm();
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Delete this room type?')) return;
    try {
      await deleteRoom(roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId));
    } catch {}
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-apple-border-light rounded-2xl" />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-apple-text">Room Management</h1>
        {!showForm && <Button onClick={() => setShowForm(true)}>+ Add Room</Button>}
      </div>

      {/* Room Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-apple-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-apple-text">{editingId ? 'Edit Room' : 'New Room Type'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="roomName" label="Room Name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Deluxe King" />
            <div>
              <label className="block text-sm font-medium text-apple-text mb-1.5">Bed Type</label>
              <select value={bedType} onChange={e => setBedType(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm">
                {BED_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input id="price" label="Price / Night ($)" type="number" step="0.01" value={pricePerNight} onChange={e => setPricePerNight(e.target.value)} required />
            <Input id="maxGuests" label="Max Guests" type="number" value={maxGuests.toString()} onChange={e => setMaxGuests(Number(e.target.value))} />
            <Input id="totalRooms" label="Total Rooms" type="number" value={totalRooms.toString()} onChange={e => setTotalRooms(Number(e.target.value))} />
          </div>
          <Input id="roomSize" label="Size (m²)" type="number" value={size} onChange={e => setSize(e.target.value)} />
          <Input id="roomImage" label="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
          <div>
            <label className="block text-sm font-medium text-apple-text mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm outline-none resize-none" />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Room' : 'Add Room'}</Button>
            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Room List */}
      {rooms.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white border border-apple-border rounded-2xl">
          <p className="text-apple-text-secondary">No rooms yet. Add your first room type.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rooms.map(room => (
            <div key={room.id} className="bg-white border border-apple-border rounded-2xl p-4 flex gap-4">
              <img src={room.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=150&fit=crop'} alt={room.name} className="w-24 h-20 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-apple-text">{room.name}</h3>
                    <p className="text-sm text-apple-text-secondary">{BED_TYPES.find(b => b.value === room.bedType)?.label} · {room.maxGuests} guests · {room.totalRooms} rooms</p>
                  </div>
                  <span className="font-semibold text-apple-text">{formatCurrency(room.pricePerNight)}<span className="text-xs font-normal text-apple-text-secondary">/night</span></span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(room)}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-apple-error" onClick={() => handleDelete(room.id)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
