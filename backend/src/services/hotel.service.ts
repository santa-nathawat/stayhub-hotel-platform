import prisma from '../lib/prisma.js';

interface SearchParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  amenities?: string[];
  page?: number;
  limit?: number;
}

export async function searchHotels(params: SearchParams) {
  const {
    city,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    stars,
    amenities,
    page = 1,
    limit = 12,
  } = params;

  const where: any = { published: true };

  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }

  if (stars && stars.length > 0) {
    where.starRating = { in: stars };
  }

  if (amenities && amenities.length > 0) {
    where.amenities = { some: { name: { in: amenities } } };
  }

  if (minPrice !== undefined || maxPrice !== undefined || guests) {
    where.rooms = {
      some: {
        ...(minPrice !== undefined && { pricePerNight: { gte: minPrice } }),
        ...(maxPrice !== undefined && { pricePerNight: { lte: maxPrice } }),
        ...(guests && { maxGuests: { gte: guests } }),
      },
    };
  }

  const [hotels, total] = await Promise.all([
    prisma.hotel.findMany({
      where,
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        amenities: true,
        rooms: {
          select: { pricePerNight: true, maxGuests: true },
          orderBy: { pricePerNight: 'asc' },
          take: 1,
        },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.hotel.count({ where }),
  ]);

  const hotelsWithStats = hotels.map(hotel => {
    const avgRating = hotel.reviews.length > 0
      ? hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length
      : 0;
    const startingPrice = hotel.rooms[0]?.pricePerNight || 0;
    return {
      ...hotel,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: hotel._count.reviews,
      startingPrice,
      reviews: undefined,
      _count: undefined,
    };
  });

  return {
    hotels: hotelsWithStats,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFeaturedHotels() {
  const hotels = await prisma.hotel.findMany({
    where: { published: true },
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      rooms: { select: { pricePerNight: true }, orderBy: { pricePerNight: 'asc' }, take: 1 },
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true } },
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
  });

  return hotels.map(hotel => {
    const avgRating = hotel.reviews.length > 0
      ? hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length
      : 0;
    return {
      ...hotel,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: hotel._count.reviews,
      startingPrice: hotel.rooms[0]?.pricePerNight || 0,
      reviews: undefined,
      _count: undefined,
    };
  });
}

export async function getHotelById(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      amenities: true,
      rooms: {
        include: { amenities: true },
        orderBy: { pricePerNight: 'asc' },
      },
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      owner: { select: { id: true, name: true } },
      _count: { select: { reviews: true } },
    },
  });

  if (!hotel) return null;

  const avgRating = hotel.reviews.length > 0
    ? hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel._count.reviews
    : 0;

  return {
    ...hotel,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: hotel._count.reviews,
    _count: undefined,
  };
}

export async function createHotel(ownerId: string, data: any) {
  const hotel = await prisma.hotel.create({
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      starRating: data.starRating || 3,
      checkInTime: data.checkInTime || '14:00',
      checkOutTime: data.checkOutTime || '11:00',
      ownerId,
      images: data.images ? {
        create: data.images.map((img: any, idx: number) => ({
          url: img.url,
          alt: img.alt || '',
          sortOrder: idx,
        })),
      } : undefined,
      amenities: data.amenities ? {
        create: data.amenities.map((a: string) => ({ name: a })),
      } : undefined,
    },
    include: {
      images: true,
      amenities: true,
    },
  });

  return hotel;
}

export async function updateHotel(id: string, ownerId: string, data: any) {
  const hotel = await prisma.hotel.findUnique({ where: { id } });
  if (!hotel || hotel.ownerId !== ownerId) {
    throw new Error('Hotel not found or unauthorized');
  }

  // Update amenities if provided
  if (data.amenities) {
    await prisma.hotelAmenity.deleteMany({ where: { hotelId: id } });
    await prisma.hotelAmenity.createMany({
      data: data.amenities.map((a: string) => ({ name: a, hotelId: id })),
    });
  }

  // Update images if provided
  if (data.images) {
    await prisma.hotelImage.deleteMany({ where: { hotelId: id } });
    await prisma.hotelImage.createMany({
      data: data.images.map((img: any, idx: number) => ({
        url: img.url,
        alt: img.alt || '',
        sortOrder: idx,
        hotelId: id,
      })),
    });
  }

  const updated = await prisma.hotel.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      starRating: data.starRating,
      checkInTime: data.checkInTime,
      checkOutTime: data.checkOutTime,
    },
    include: {
      images: true,
      amenities: true,
      rooms: true,
    },
  });

  return updated;
}

export async function deleteHotel(id: string, ownerId: string) {
  const hotel = await prisma.hotel.findUnique({ where: { id } });
  if (!hotel || hotel.ownerId !== ownerId) {
    throw new Error('Hotel not found or unauthorized');
  }

  await prisma.hotel.delete({ where: { id } });
}

export async function togglePublish(id: string, ownerId: string) {
  const hotel = await prisma.hotel.findUnique({ where: { id } });
  if (!hotel || hotel.ownerId !== ownerId) {
    throw new Error('Hotel not found or unauthorized');
  }

  return prisma.hotel.update({
    where: { id },
    data: { published: !hotel.published },
  });
}

export async function getMyHotels(ownerId: string) {
  return prisma.hotel.findMany({
    where: { ownerId },
    include: {
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      rooms: { select: { id: true } },
      _count: { select: { bookings: true, reviews: true, rooms: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
