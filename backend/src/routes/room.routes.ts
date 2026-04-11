import { Router } from 'express';
import * as roomController from '../controllers/room.controller.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = Router();

// Public
router.get('/hotels/:hotelId/rooms', roomController.getRoomsByHotel);

// Partner
router.post('/hotels/:hotelId/rooms', authenticate, requireRole('PARTNER'), roomController.createRoom);
router.put('/:id', authenticate, requireRole('PARTNER'), roomController.updateRoom);
router.delete('/:id', authenticate, requireRole('PARTNER'), roomController.deleteRoom);
router.put('/:id/availability', authenticate, requireRole('PARTNER'), roomController.updateAvailability);

export default router;
