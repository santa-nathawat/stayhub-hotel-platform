import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getHotelReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { page, limit } = req.query;
    const result = await reviewService.getHotelReviews(
      req.params.hotelId as string,
      page ? parseInt(page as string) : 1,
      limit ? parseInt(limit as string) : 10,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewService.createReview(req.user!.userId, req.params.hotelId as string, req.body);
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already reviewed')) {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await reviewService.deleteReview(req.params.id as string, req.user!.userId);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}
