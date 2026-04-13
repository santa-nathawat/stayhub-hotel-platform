import { Request, Response, NextFunction } from 'express';
import * as hotelService from '../services/hotel.service.js';
import { AuthRequest } from '../middleware/auth.js';

export async function searchHotels(req: Request, res: Response, next: NextFunction) {
  try {
    const { city, checkIn, checkOut, guests, minPrice, maxPrice, stars, amenities, page, limit } = req.query;
    const result = await hotelService.searchHotels({
      city: city as string,
      checkIn: checkIn as string,
      checkOut: checkOut as string,
      guests: guests ? parseInt(guests as string) : undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      stars: stars ? (stars as string).split(',').map(Number) : undefined,
      amenities: amenities ? (amenities as string).split(',') : undefined,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 12,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedHotels(_req: Request, res: Response, next: NextFunction) {
  try {
    const hotels = await hotelService.getFeaturedHotels();
    res.json(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelById(req: Request, res: Response, next: NextFunction) {
  try {
    const hotel = await hotelService.getHotelById(req.params.id as string);
    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }
    res.json(hotel);
  } catch (error) {
    next(error);
  }
}

export async function createHotel(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const hotel = await hotelService.createHotel(req.user!.userId, req.body);
    res.status(201).json(hotel);
  } catch (error) {
    next(error);
  }
}

export async function updateHotel(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const hotel = await hotelService.updateHotel(req.params.id as string, req.user!.userId, req.body);
    res.json(hotel);
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function deleteHotel(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await hotelService.deleteHotel(req.params.id as string, req.user!.userId);
    res.json({ message: 'Hotel deleted' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('unauthorized')) {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function togglePublish(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const hotel = await hotelService.togglePublish(req.params.id as string, req.user!.userId);
    res.json(hotel);
  } catch (error) {
    next(error);
  }
}

export async function getMyHotels(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const hotels = await hotelService.getMyHotels(req.user!.userId);
    res.json(hotels);
  } catch (error) {
    next(error);
  }
}
