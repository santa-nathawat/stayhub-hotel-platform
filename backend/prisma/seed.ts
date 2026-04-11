import 'dotenv/config';
import { PrismaClient } from '.prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/hotel_booking';
const pool = new pg.Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const hotels = [
  {
    name: 'The Grand Palace Hotel',
    description: 'A stunning luxury hotel in the heart of Bangkok, offering world-class amenities and breathtaking views of the city skyline. Experience true Thai hospitality with impeccable service.',
    address: '89 Ratchadamri Road',
    city: 'Bangkok',
    country: 'Thailand',
    latitude: 13.7445,
    longitude: 100.5420,
    starRating: 5,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Airport Shuttle'],
    rooms: [
      { name: 'Deluxe King Room', bedType: 'KING', maxGuests: 2, size: 45, pricePerNight: 280, totalRooms: 20, description: 'Spacious room with city views and premium amenities.' },
      { name: 'Superior Twin Room', bedType: 'TWIN', maxGuests: 2, size: 38, pricePerNight: 220, totalRooms: 15, description: 'Comfortable twin room ideal for colleagues or friends.' },
      { name: 'Grand Suite', bedType: 'KING', maxGuests: 3, size: 90, pricePerNight: 580, totalRooms: 5, description: 'Luxurious suite with separate living area and panoramic views.' },
    ],
  },
  {
    name: 'Sakura Inn Tokyo',
    description: 'A boutique hotel blending modern Japanese minimalism with traditional charm. Located steps away from Shinjuku station, offering easy access to all of Tokyo\'s major attractions.',
    address: '1-12-3 Shinjuku',
    city: 'Tokyo',
    country: 'Japan',
    latitude: 35.6938,
    longitude: 139.7034,
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Air Conditioning', 'Laundry', 'Business Center'],
    rooms: [
      { name: 'Standard Room', bedType: 'QUEEN', maxGuests: 2, size: 28, pricePerNight: 150, totalRooms: 30, description: 'Clean and cozy room with all essential amenities.' },
      { name: 'Deluxe Double', bedType: 'QUEEN', maxGuests: 2, size: 35, pricePerNight: 210, totalRooms: 18, description: 'Upgraded room with enhanced furnishings and city view.' },
      { name: 'Family Room', bedType: 'TWIN', maxGuests: 4, size: 55, pricePerNight: 310, totalRooms: 8, description: 'Spacious family room with extra beds available.' },
    ],
  },
  {
    name: 'Le Marais Boutique Hotel',
    description: 'Nestled in Paris\'s most fashionable neighborhood, this intimate hotel offers Parisian elegance with a modern twist. Steps from the Louvre and Notre-Dame Cathedral.',
    address: '14 Rue de Bretagne',
    city: 'Paris',
    country: 'France',
    latitude: 48.8629,
    longitude: 2.3612,
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Room Service', 'Air Conditioning', 'Laundry'],
    rooms: [
      { name: 'Classic Room', bedType: 'QUEEN', maxGuests: 2, size: 22, pricePerNight: 190, totalRooms: 12, description: 'Charming Parisian room with classic decor.' },
      { name: 'Superior Room', bedType: 'KING', maxGuests: 2, size: 30, pricePerNight: 260, totalRooms: 8, description: 'Spacious room with elegant furnishings and parquet floors.' },
      { name: 'Junior Suite', bedType: 'KING', maxGuests: 2, size: 45, pricePerNight: 380, totalRooms: 3, description: 'Suite with separate sitting area and luxury bathroom.' },
    ],
  },
  {
    name: 'Marina Bay Resort',
    description: 'An iconic luxury resort overlooking Singapore\'s stunning Marina Bay. Features an infinity pool with panoramic skyline views and world-class dining experiences.',
    address: '10 Bayfront Avenue',
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.2834,
    longitude: 103.8607,
    starRating: 5,
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Beach Access'],
    rooms: [
      { name: 'Deluxe Bay View', bedType: 'KING', maxGuests: 2, size: 42, pricePerNight: 420, totalRooms: 25, description: 'Room with stunning bay views and floor-to-ceiling windows.' },
      { name: 'Premier Room', bedType: 'QUEEN', maxGuests: 2, size: 38, pricePerNight: 350, totalRooms: 30, description: 'Premier room with garden or pool views.' },
      { name: 'Sky Suite', bedType: 'KING', maxGuests: 3, size: 120, pricePerNight: 1200, totalRooms: 4, description: 'Spectacular sky suite with private infinity pool access.' },
    ],
  },
  {
    name: 'Coastal Breeze Resort',
    description: 'A tranquil beach resort on Bali\'s stunning Seminyak beach. Enjoy private villas with plunge pools, sunset views, and authentic Balinese hospitality.',
    address: 'Jl. Kayu Cendana No.9, Seminyak',
    city: 'Bali',
    country: 'Indonesia',
    latitude: -8.6873,
    longitude: 115.1589,
    starRating: 5,
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Beach Access', 'Room Service', 'Airport Shuttle'],
    rooms: [
      { name: 'Garden Villa', bedType: 'KING', maxGuests: 2, size: 80, pricePerNight: 320, totalRooms: 10, description: 'Private villa with garden and outdoor shower.' },
      { name: 'Pool Villa', bedType: 'KING', maxGuests: 2, size: 120, pricePerNight: 550, totalRooms: 6, description: 'Luxurious villa with private plunge pool.' },
    ],
  },
  {
    name: 'Times Square Hotel New York',
    description: 'Located in the heart of Manhattan, this modern hotel puts you steps away from Broadway, world-class dining, and iconic New York City attractions.',
    address: '1568 Broadway',
    city: 'New York',
    country: 'United States',
    latitude: 40.7580,
    longitude: -73.9855,
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Business Center', 'Laundry'],
    rooms: [
      { name: 'City View Queen', bedType: 'QUEEN', maxGuests: 2, size: 28, pricePerNight: 280, totalRooms: 40, description: 'Modern room with Times Square city views.' },
      { name: 'Deluxe King', bedType: 'KING', maxGuests: 2, size: 35, pricePerNight: 360, totalRooms: 25, description: 'Spacious king room with panoramic Manhattan views.' },
      { name: 'Junior Suite', bedType: 'KING', maxGuests: 3, size: 55, pricePerNight: 520, totalRooms: 10, description: 'Suite with separate living area and stunning city views.' },
    ],
  },
  {
    name: 'Riad Andaluz',
    description: 'A beautifully restored 19th-century riad in the heart of Marrakech\'s ancient medina. Features traditional Moroccan architecture with a lush courtyard and rooftop terrace.',
    address: '23 Derb Sidi Ahmed Soussa, Medina',
    city: 'Marrakech',
    country: 'Morocco',
    latitude: 31.6259,
    longitude: -7.9891,
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1533395427226-788cee21cc9e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Air Conditioning', 'Room Service'],
    rooms: [
      { name: 'Standard Room', bedType: 'QUEEN', maxGuests: 2, size: 25, pricePerNight: 120, totalRooms: 6, description: 'Cozy room with traditional Moroccan tiles and decor.' },
      { name: 'Deluxe Suite', bedType: 'KING', maxGuests: 2, size: 40, pricePerNight: 195, totalRooms: 4, description: 'Romantic suite with courtyard views and private terrace.' },
    ],
  },
  {
    name: 'Alpine Lodge Zurich',
    description: 'A charming hotel with stunning views of the Swiss Alps and Lake Zurich. Combining modern Swiss design with warm alpine hospitality.',
    address: 'Talstrasse 1',
    city: 'Zurich',
    country: 'Switzerland',
    latitude: 47.3769,
    longitude: 8.5417,
    starRating: 4,
    images: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
    ],
    amenities: ['WiFi', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'Hot Tub'],
    rooms: [
      { name: 'Mountain View Room', bedType: 'QUEEN', maxGuests: 2, size: 32, pricePerNight: 310, totalRooms: 15, description: 'Comfortable room with panoramic mountain views.' },
      { name: 'Lake View Suite', bedType: 'KING', maxGuests: 2, size: 55, pricePerNight: 480, totalRooms: 6, description: 'Elegant suite overlooking Lake Zurich.' },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create partner user
  const partnerHash = await bcrypt.hash('password123', 12);
  const partner = await prisma.user.upsert({
    where: { email: 'partner@stayhub.com' },
    update: {},
    create: {
      name: 'StayHub Partner',
      email: 'partner@stayhub.com',
      passwordHash: partnerHash,
      role: 'PARTNER',
    },
  });
  console.log('✅ Partner created:', partner.email);

  // Create guest user
  const guestHash = await bcrypt.hash('password123', 12);
  const guest = await prisma.user.upsert({
    where: { email: 'guest@stayhub.com' },
    update: {},
    create: {
      name: 'John Traveler',
      email: 'guest@stayhub.com',
      passwordHash: guestHash,
      role: 'GUEST',
    },
  });
  console.log('✅ Guest created:', guest.email);

  // Create hotels
  for (const hotelData of hotels) {
    const existing = await prisma.hotel.findFirst({ where: { name: hotelData.name } });
    if (existing) {
      console.log(`⏭️  Skipping existing hotel: ${hotelData.name}`);
      continue;
    }

    const hotel = await prisma.hotel.create({
      data: {
        name: hotelData.name,
        description: hotelData.description,
        address: hotelData.address,
        city: hotelData.city,
        country: hotelData.country,
        latitude: hotelData.latitude,
        longitude: hotelData.longitude,
        starRating: hotelData.starRating,
        published: true,
        ownerId: partner.id,
        images: {
          create: hotelData.images.map((url, i) => ({ url, sortOrder: i })),
        },
        amenities: {
          create: hotelData.amenities.map(name => ({ name })),
        },
        rooms: {
          create: hotelData.rooms.map(room => ({
            name: room.name,
            description: room.description,
            bedType: room.bedType,
            maxGuests: room.maxGuests,
            size: room.size,
            pricePerNight: room.pricePerNight,
            totalRooms: room.totalRooms,
            imageUrl: `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop`,
          })),
        },
      },
    });

    console.log(`✅ Hotel created: ${hotel.name}`);

    // Add a sample review
    await prisma.review.upsert({
      where: { userId_hotelId: { userId: guest.id, hotelId: hotel.id } },
      update: {},
      create: {
        rating: 5,
        title: 'Amazing experience!',
        comment: `We had a wonderful stay at ${hotel.name}. The rooms were immaculate, the staff was incredibly helpful, and the location couldn't be better. Highly recommend!`,
        userId: guest.id,
        hotelId: hotel.id,
      },
    });
  }

  console.log('\n🎉 Seeding complete!');
  console.log('\nTest accounts:');
  console.log('  Guest:   guest@stayhub.com / password123');
  console.log('  Partner: partner@stayhub.com / password123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
