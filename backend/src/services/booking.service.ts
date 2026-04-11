import prisma from '../lib/prisma.js';
import { differenceInDays } from 'date-fns';

interface CreateBookingInput {
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}

export async function createBooking(userId: string, input: CreateBookingInput) {
  const checkInDate = new Date(input.checkIn);
  const checkOutDate = new Date(input.checkOut);
  const nights = differenceInDays(checkOutDate, checkInDate);

  if (nights <= 0) {
    throw new Error('Check-out must be after check-in');
  }

  const room = await prisma.roomType.findUnique({
    where: { id: input.roomTypeId },
    include: { hotel: true },
  });

  if (!room || room.hotelId !== input.hotelId) {
    throw new Error('Room not found');
  }

  if (input.guests > room.maxGuests) {
    throw new Error('Too many guests for this room type');
  }

  const totalPrice = room.pricePerNight * nights;

  const booking = await prisma.booking.create({
    data: {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: input.guests,
      totalPrice,
      guestName: input.guestName,
      guestEmail: input.guestEmail,
      guestPhone: input.guestPhone,
      specialRequests: input.specialRequests,
      userId,
      hotelId: input.hotelId,
      roomTypeId: input.roomTypeId,
      status: 'CONFIRMED',
    },
    include: {
      hotel: { select: { id: true, name: true, city: true, country: true } },
      roomType: { select: { id: true, name: true, bedType: true } },
    },
  });

  return booking;
}

export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      hotel: {
        select: {
          id: true, name: true, city: true, country: true,
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
        },
      },
      roomType: { select: { id: true, name: true, bedType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getBookingById(id: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      hotel: {
        select: {
          id: true, name: true, city: true, country: true, address: true,
          checkInTime: true, checkOutTime: true,
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
        },
      },
      roomType: { select: { id: true, name: true, bedType: true, maxGuests: true } },
    },
  });

  if (!booking) throw new Error('Booking not found');

  // Allow both the guest and the hotel owner to view
  if (booking.userId !== userId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: booking.hotelId },
      select: { ownerId: true },
    });
    if (!hotel || hotel.ownerId !== userId) {
      throw new Error('Unauthorized');
    }
  }

  return booking;
}

export async function cancelBooking(id: string, userId: string) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error('Booking not found');

  // Check if user is the guest or the hotel owner
  if (booking.userId !== userId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: booking.hotelId },
      select: { ownerId: true },
    });
    if (!hotel || hotel.ownerId !== userId) {
      throw new Error('Unauthorized');
    }
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking is already cancelled');
  }

  return prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}

export async function confirmBooking(id: string, ownerId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { hotel: { select: { ownerId: true } } },
  });

  if (!booking || booking.hotel.ownerId !== ownerId) {
    throw new Error('Booking not found or unauthorized');
  }

  return prisma.booking.update({
    where: { id },
    data: { status: 'CONFIRMED' },
  });
}

export async function getHotelBookings(hotelId: string, ownerId: string) {
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel || hotel.ownerId !== ownerId) {
    throw new Error('Hotel not found or unauthorized');
  }

  return prisma.booking.findMany({
    where: { hotelId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      roomType: { select: { id: true, name: true, bedType: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
