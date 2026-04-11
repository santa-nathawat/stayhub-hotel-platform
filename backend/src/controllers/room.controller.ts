import { Request, Response, NextFunction } from 'express';
import * as roomService from '../services/room.service.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getRoomsByHotel(req: Request, res: Response, next: NextFunction) {
  try {
    const rooms = await roomService.getRoomsByHotel(req.params.hotelId);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
}

export async function createRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const room = await roomService.createRoom(req.params.hotelId, req.user!.userId, req.body);
    res.status(201).json(room);
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function updateRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const room = await roomService.updateRoom(req.params.id, req.user!.userId, req.body);
    res.json(room);
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function deleteRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await roomService.deleteRoom(req.params.id, req.user!.userId);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function updateAvailability(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await roomService.updateAvailability(req.params.id, req.user!.userId, req.body.dates);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
