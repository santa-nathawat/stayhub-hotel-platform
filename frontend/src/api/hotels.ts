import api from './client';
import type { Hotel, SearchParams, Pagination } from '../types';

interface SearchResponse {
  hotels: Hotel[];
  pagination: Pagination;
}

export async function searchHotels(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  if (params.city) searchParams.set('city', params.city);
  if (params.checkIn) searchParams.set('checkIn', params.checkIn);
  if (params.checkOut) searchParams.set('checkOut', params.checkOut);
  if (params.guests) searchParams.set('guests', String(params.guests));
  if (params.minPrice) searchParams.set('minPrice', String(params.minPrice));
  if (params.maxPrice) searchParams.set('maxPrice', String(params.maxPrice));
  if (params.stars?.length) searchParams.set('stars', params.stars.join(','));
  if (params.amenities?.length) searchParams.set('amenities', params.amenities.join(','));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const res = await api.get(`/hotels?${searchParams.toString()}`);
  return res.data;
}

export async function getFeaturedHotels(): Promise<Hotel[]> {
  const res = await api.get('/hotels/featured');
  return res.data;
}

export async function getHotelById(id: string): Promise<Hotel> {
  const res = await api.get(`/hotels/${id}`);
  return res.data;
}

export async function getMyHotels(): Promise<Hotel[]> {
  const res = await api.get('/hotels/my');
  return res.data;
}

export async function createHotel(data: any): Promise<Hotel> {
  const res = await api.post('/hotels', data);
  return res.data;
}

export async function updateHotel(id: string, data: any): Promise<Hotel> {
  const res = await api.put(`/hotels/${id}`, data);
  return res.data;
}

export async function deleteHotel(id: string): Promise<void> {
  await api.delete(`/hotels/${id}`);
}

export async function togglePublish(id: string): Promise<Hotel> {
  const res = await api.patch(`/hotels/${id}/publish`);
  return res.data;
}
