import { Response, NextFunction } from 'express';
import * as bookingService from '../services/booking.service.js';
import { AuthRequest } from '../middleware/auth.js';

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.createBooking(req.user!.userId, req.body);
    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('Too many')) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function getUserBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.getUserBookings(req.user!.userId);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user!.userId);
    res.json(booking);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Booking not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Unauthorized') {
        res.status(403).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function cancelBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user!.userId);
    res.json(booking);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        res.status(403).json({ error: error.message });
        return;
      }
      if (error.message.includes('already cancelled')) {
        res.status(400).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function confirmBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const booking = await bookingService.confirmBooking(req.params.id, req.user!.userId);
    res.json(booking);
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function getHotelBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.getHotelBookings(req.params.hotelId, req.user!.userId);
    res.json(bookings);
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}
