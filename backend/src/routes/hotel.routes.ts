import { Router } from 'express';
import * as hotelController from '../controllers/hotel.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();

// Public routes
router.get('/', hotelController.searchHotels);
router.get('/featured', hotelController.getFeaturedHotels);
router.get('/my', authenticate, requireRole('PARTNER'), hotelController.getMyHotels);
router.get('/:id', hotelController.getHotelById);

// Partner routes
router.post('/', authenticate, requireRole('PARTNER'), hotelController.createHotel);
router.put('/:id', authenticate, requireRole('PARTNER'), hotelController.updateHotel);
router.delete('/:id', authenticate, requireRole('PARTNER'), hotelController.deleteHotel);
router.patch('/:id/publish', authenticate, requireRole('PARTNER'), hotelController.togglePublish);

export default router;
