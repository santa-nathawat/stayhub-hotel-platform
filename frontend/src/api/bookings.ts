import api from './client';
import type { Booking } from '../types';

export async function createBooking(data: {
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}): Promise<Booking> {
  const res = await api.post('/bookings', data);
  return res.data;
}

export async function getUserBookings(): Promise<Booking[]> {
  const res = await api.get('/bookings');
  return res.data;
}

export async function getBookingById(id: string): Promise<Booking> {
  const res = await api.get(`/bookings/${id}`);
  return res.data;
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data;
}

export async function confirmBooking(id: string): Promise<Booking> {
  const res = await api.patch(`/bookings/${id}/confirm`);
  return res.data;
}

export async function getHotelBookings(hotelId: string): Promise<Booking[]> {
  const res = await api.get(`/bookings/hotel/${hotelId}`);
  return res.data;
}
