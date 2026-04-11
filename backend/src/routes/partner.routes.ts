import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';
import { AuthRequest } from '../middleware/auth.js';
import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.use(authenticate, requireRole('PARTNER'));

router.get('/stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user!.userId;
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      select: { id: true },
    });
    const hotelIds = hotels.map(h => h.id);

    const [totalBookings, revenue, reviews] = await Promise.all([
      prisma.booking.count({
        where: { hotelId: { in: hotelIds }, status: { not: 'CANCELLED' } },
      }),
      prisma.booking.aggregate({
        where: { hotelId: { in: hotelIds }, status: { not: 'CANCELLED' } },
        _sum: { totalPrice: true },
      }),
      prisma.review.aggregate({
        where: { hotelId: { in: hotelIds } },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    const totalRooms = await prisma.roomType.aggregate({
      where: { hotelId: { in: hotelIds } },
      _sum: { totalRooms: true },
    });

    const occupancyRate = totalRooms._sum.totalRooms
      ? Math.round((totalBookings / (totalRooms._sum.totalRooms * 30)) * 100)
      : 0;

    res.json({
      totalBookings,
      totalRevenue: revenue._sum.totalPrice || 0,
      avgRating: Math.round((reviews._avg.rating || 0) * 10) / 10,
      totalReviews: reviews._count,
      totalHotels: hotels.length,
      occupancyRate: Math.min(occupancyRate, 100),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/revenue-chart', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user!.userId;
    const hotels = await prisma.hotel.findMany({
      where: { ownerId },
      select: { id: true },
    });
    const hotelIds = hotels.map(h => h.id);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: { in: hotelIds },
        status: { not: 'CANCELLED' },
        createdAt: { gte: sixMonthsAgo },
      },
      select: { totalPrice: true, createdAt: true },
    });

    const monthlyRevenue: Record<string, number> = {};
    bookings.forEach(b => {
      const key = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + b.totalPrice;
    });

    const data = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));

    res.json(data);
  } catch (error) {
    next(error);
  }
});

export default router;
