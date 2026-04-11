import prisma from '../lib/prisma.js';

export async function getHotelReviews(hotelId: string, page = 1, limit = 10) {
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { hotelId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where: { hotelId } }),
  ]);

  return { reviews, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function createReview(userId: string, hotelId: string, data: { rating: number; title?: string; comment: string }) {
  const existing = await prisma.review.findUnique({
    where: { userId_hotelId: { userId, hotelId } },
  });

  if (existing) {
    throw new Error('You have already reviewed this hotel');
  }

  return prisma.review.create({
    data: {
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      userId,
      hotelId,
    },
    include: { user: { select: { id: true, name: true, image: true } } },
  });
}

export async function deleteReview(id: string, userId: string) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.userId !== userId) {
    throw new Error('Review not found or unauthorized');
  }

  await prisma.review.delete({ where: { id } });
}
