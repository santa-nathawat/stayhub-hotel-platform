import { useState, useRef } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { AMENITIES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import api from '../../api/client';

interface HotelFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  images: { url: string; alt?: string }[];
}

interface HotelFormProps {
  initialData?: Partial<HotelFormData>;
  onSubmit: (data: HotelFormData) => Promise<void>;
  submitLabel: string;
}

export default function HotelForm({ initialData, onSubmit, submitLabel }: HotelFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [country, setCountry] = useState(initialData?.country || '');
  const [latitude, setLatitude] = useState(initialData?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialData?.longitude?.toString() || '');
  const [starRating, setStarRating] = useState(initialData?.starRating || 3);
  const [checkInTime, setCheckInTime] = useState(initialData?.checkInTime || '14:00');
  const [checkOutTime, setCheckOutTime] = useState(initialData?.checkOutTime || '11:00');
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [images, setImages] = useState<{ url: string; alt?: string }[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAmenity = (a: string) => {
    setAmenities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setImages(prev => [...prev, { url: res.data.url, alt: file.name }]);
      }
    } catch {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit({
        name, description, address, city, country,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        starRating, checkInTime, checkOutTime, amenities, images,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save hotel');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-apple-error text-sm px-4 py-3 rounded-xl">{error}</div>}

      <div className="bg-white border border-apple-border rounded-2xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-apple-text">Basic Information</h2>
        <Input id="name" label="Hotel Name" value={name} onChange={e => setName(e.target.value)} required />
        <div>
          <label className="block text-sm font-medium text-apple-text mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-apple-blue/20 resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="address" label="Address" value={address} onChange={e => setAddress(e.target.value)} required />
          <Input id="city" label="City" value={city} onChange={e => setCity(e.target.value)} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input id="country" label="Country" value={country} onChange={e => setCountry(e.target.value)} required />
          <Input id="lat" label="Latitude" type="number" step="any" value={latitude} onChange={e => setLatitude(e.target.value)} />
          <Input id="lng" label="Longitude" type="number" step="any" value={longitude} onChange={e => setLongitude(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-apple-text mb-1.5">Star Rating</label>
            <select value={starRating} onChange={e => setStarRating(Number(e.target.value))} className="w-full px-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <Input id="checkIn" type="time" label="Check-in Time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} />
          <Input id="checkOut" type="time" label="Check-out Time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white border border-apple-border rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-apple-text">Images</h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-apple-border rounded-xl py-8 flex flex-col items-center gap-2 text-apple-text-secondary hover:border-apple-blue hover:text-apple-blue transition-colors disabled:opacity-50"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Click to upload photos'}
            </span>
            <span className="text-xs">JPG, PNG, WebP — multiple files supported</span>
          </button>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-20 rounded-lg overflow-hidden">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <div className="bg-white border border-apple-border rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-apple-text">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                amenities.includes(a) ? 'border-apple-blue bg-apple-blue-light text-apple-blue' : 'border-apple-border text-apple-text-secondary hover:border-gray-300'
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
