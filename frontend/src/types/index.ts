export interface User {
  id: string;
  name: string;
  email: string;
  role: 'GUEST' | 'PARTNER';
  image?: string | null;
  phone?: string | null;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  images: HotelImage[];
  amenities: HotelAmenity[];
  rooms: RoomType[];
  reviews?: Review[];
  owner?: { id: string; name: string };
  avgRating: number;
  reviewCount: number;
  startingPrice?: number;
  _count?: { bookings: number; reviews: number; rooms: number };
}

export interface HotelImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface HotelAmenity {
  id: string;
  name: string;
  icon?: string | null;
}

export interface RoomType {
  id: string;
  name: string;
  description?: string | null;
  maxGuests: number;
  bedType: string;
  size?: number | null;
  pricePerNight: number;
  totalRooms: number;
  imageUrl?: string | null;
  hotelId: string;
  amenities: RoomAmenity[];
}

export interface RoomAmenity {
  id: string;
  name: string;
}

export interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  specialRequests?: string | null;
  createdAt: string;
  userId: string;
  hotelId: string;
  roomTypeId: string;
  hotel: {
    id: string;
    name: string;
    city: string;
    country: string;
    address?: string;
    checkInTime?: string;
    checkOutTime?: string;
    images?: HotelImage[];
  };
  roomType: {
    id: string;
    name: string;
    bedType: string;
    maxGuests?: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string;
  userId: string;
  hotelId: string;
  user: {
    id: string;
    name: string;
    image?: string | null;
  };
}

export interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  amenities?: string[];
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PartnerStats {
  totalBookings: number;
  totalRevenue: number;
  avgRating: number;
  totalReviews: number;
  totalHotels: number;
  occupancyRate: number;
}
