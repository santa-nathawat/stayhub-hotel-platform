import { useState } from 'react';
import type { HotelImage } from '../../types';

interface PhotoGalleryProps {
  images: HotelImage[];
  hotelName: string;
}

export default function PhotoGallery({ images, hotelName }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const displayImages = images.length > 0 ? images : [
    { id: '1', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', alt: hotelName, sortOrder: 0 },
    { id: '2', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop', alt: 'Room', sortOrder: 1 },
    { id: '3', url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop', alt: 'Pool', sortOrder: 2 },
    { id: '4', url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop', alt: 'Lobby', sortOrder: 3 },
    { id: '5', url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop', alt: 'View', sortOrder: 4 },
  ];

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[400px]">
        {/* Main image */}
        <div
          className="col-span-2 row-span-2 cursor-pointer overflow-hidden"
          onClick={() => setLightbox(0)}
        >
          <img
            src={displayImages[0]?.url}
            alt={displayImages[0]?.alt || hotelName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Smaller images */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div
            key={img.id}
            className="cursor-pointer overflow-hidden relative"
            onClick={() => setLightbox(idx + 1)}
          >
            <img
              src={img.url}
              alt={img.alt || hotelName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
            {idx === 3 && displayImages.length > 5 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-medium">+{displayImages.length - 5} more</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            onClick={() => setLightbox(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute left-4 text-white/80 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.max(0, lightbox - 1)); }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={displayImages[lightbox]?.url}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 text-white/80 hover:text-white p-2"
            onClick={(e) => { e.stopPropagation(); setLightbox(Math.min(displayImages.length - 1, lightbox + 1)); }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm">
            {lightbox + 1} / {displayImages.length}
          </div>
        </div>
      )}
    </>
  );
}
