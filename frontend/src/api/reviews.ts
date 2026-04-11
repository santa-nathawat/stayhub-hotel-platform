import api from './client';
import type { Review, Pagination } from '../types';

interface ReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
}

export async function getHotelReviews(hotelId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
  const res = await api.get(`/reviews/hotels/${hotelId}/reviews?page=${page}&limit=${limit}`);
  return res.data;
}

export async function createReview(hotelId: string, data: { rating: number; title?: string; comment: string }): Promise<Review> {
  const res = await api.post(`/reviews/hotels/${hotelId}/reviews`, data);
  return res.data;
}

export async function deleteReview(id: string): Promise<void> {
  await api.delete(`/reviews/${id}`);
}
