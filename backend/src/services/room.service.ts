import prisma from '../lib/prisma.js';

export async function getRoomsByHotel(hotelId: string) {
  return prisma.roomType.findMany({
    where: { hotelId },
    include: { amenities: true, availability: true },
    orderBy: { pricePerNight: 'asc' },
  });
}

export async function createRoom(hotelId: string, ownerId: string, data: any) {
  const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotel || hotel.ownerId !== ownerId) {
    throw new Error('Hotel not found or unauthorized');
  }

  return prisma.roomType.create({
    data: {
      name: data.name,
      description: data.description,
      maxGuests: data.maxGuests || 2,
      bedType: data.bedType,
      size: data.size,
      pricePerNight: data.pricePerNight,
      totalRooms: data.totalRooms || 1,
      imageUrl: data.imageUrl,
      hotelId,
      amenities: data.amenities ? {
        create: data.amenities.map((a: string) => ({ name: a })),
      } : undefined,
    },
    include: { amenities: true },
  });
}

export async function updateRoom(id: string, ownerId: string, data: any) {
  const room = await prisma.roomType.findUnique({
    where: { id },
    include: { hotel: { select: { ownerId: true } } },
  });
  if (!room || room.hotel.ownerId !== ownerId) {
    throw new Error('Room not found or unauthorized');
  }

  if (data.amenities) {
    await prisma.roomAmenity.deleteMany({ where: { roomTypeId: id } });
    await prisma.roomAmenity.createMany({
      data: data.amenities.map((a: string) => ({ name: a, roomTypeId: id })),
    });
  }

  return prisma.roomType.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      maxGuests: data.maxGuests,
      bedType: data.bedType,
      size: data.size,
      pricePerNight: data.pricePerNight,
      totalRooms: data.totalRooms,
      imageUrl: data.imageUrl,
    },
    include: { amenities: true },
  });
}

export async function deleteRoom(id: string, ownerId: string) {
  const room = await prisma.roomType.findUnique({
    where: { id },
    include: { hotel: { select: { ownerId: true } } },
  });
  if (!room || room.hotel.ownerId !== ownerId) {
    throw new Error('Room not found or unauthorized');
  }

  await prisma.roomType.delete({ where: { id } });
}

export async function updateAvailability(roomId: string, ownerId: string, dates: { date: string; available: number; price?: number }[]) {
  const room = await prisma.roomType.findUnique({
    where: { id: roomId },
    include: { hotel: { select: { ownerId: true } } },
  });
  if (!room || room.hotel.ownerId !== ownerId) {
    throw new Error('Room not found or unauthorized');
  }

  const operations = dates.map(d =>
    prisma.roomAvailability.upsert({
      where: {
        roomTypeId_date: { roomTypeId: roomId, date: new Date(d.date) },
      },
      create: {
        roomTypeId: roomId,
        date: new Date(d.date),
        available: d.available,
        price: d.price,
      },
      update: {
        available: d.available,
        price: d.price,
      },
    })
  );

  return Promise.all(operations);
}
