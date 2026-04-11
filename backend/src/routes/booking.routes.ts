import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getUserBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.patch('/:id/cancel', authenticate, bookingController.cancelBooking);
router.patch('/:id/confirm', authenticate, requireRole('PARTNER'), bookingController.confirmBooking);
router.get('/hotel/:hotelId', authenticate, requireRole('PARTNER'), bookingController.getHotelBookings);

export default router;
