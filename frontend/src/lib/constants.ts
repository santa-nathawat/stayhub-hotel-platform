export const AMENITIES = [
  'WiFi',
  'Pool',
  'Gym',
  'Spa',
  'Parking',
  'Restaurant',
  'Bar',
  'Room Service',
  'Airport Shuttle',
  'Pet Friendly',
  'Air Conditioning',
  'Laundry',
  'Business Center',
  'Beach Access',
  'Hot Tub',
  'Kitchen',
] as const;

export const BED_TYPES = [
  { value: 'KING', label: 'King Bed' },
  { value: 'QUEEN', label: 'Queen Bed' },
  { value: 'TWIN', label: 'Twin Beds' },
  { value: 'SINGLE', label: 'Single Bed' },
] as const;

export const ROOM_AMENITIES = [
  'TV',
  'Mini Bar',
  'Safe',
  'Balcony',
  'Ocean View',
  'City View',
  'Bathtub',
  'Shower',
  'Desk',
  'Coffee Maker',
] as const;

export const BOOKING_STATUSES = {
  PENDING: { label: 'Pending', color: 'warning' },
  CONFIRMED: { label: 'Confirmed', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'error' },
  COMPLETED: { label: 'Completed', color: 'default' },
} as const;
