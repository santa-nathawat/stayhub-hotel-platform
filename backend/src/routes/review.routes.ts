import { Router } from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/hotels/:hotelId/reviews', reviewController.getHotelReviews);
router.post('/hotels/:hotelId/reviews', authenticate, reviewController.createReview);
router.delete('/:id', authenticate, reviewController.deleteReview);

export default router;
