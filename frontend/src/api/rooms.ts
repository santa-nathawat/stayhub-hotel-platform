import api from './client';
import type { RoomType } from '../types';

export async function getRoomsByHotel(hotelId: string): Promise<RoomType[]> {
  const res = await api.get(`/rooms/hotels/${hotelId}/rooms`);
  return res.data;
}

export async function createRoom(hotelId: string, data: any): Promise<RoomType> {
  const res = await api.post(`/rooms/hotels/${hotelId}/rooms`, data);
  return res.data;
}

export async function updateRoom(id: string, data: any): Promise<RoomType> {
  const res = await api.put(`/rooms/${id}`, data);
  return res.data;
}

export async function deleteRoom(id: string): Promise<void> {
  await api.delete(`/rooms/${id}`);
}

export async function updateAvailability(roomId: string, dates: { date: string; available: number; price?: number }[]) {
  const res = await api.put(`/rooms/${roomId}/availability`, { dates });
  return res.data;
}
