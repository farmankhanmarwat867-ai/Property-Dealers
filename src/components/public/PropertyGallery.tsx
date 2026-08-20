import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop&q=80',
  ];

  const displayImages = images && images.length > 0 ? images : fallbackImages;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="space-y-3">
      {/* Main Image Stage */}
      <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-xl group">
        <img
          src={displayImages[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md transition opacity-80 group-hover:opacity-100"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white backdrop-blur-md transition opacity-80 group-hover:opacity-100"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen & Counter bar */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-slate-950/70 text-white backdrop-blur-md rounded-lg border border-white/20">
            {currentIndex + 1} / {displayImages.length}
          </span>
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md border border-white/20 transition"
            aria-label="Open fullscreen gallery"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thumbnails strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative shrink-0 w-20 sm:w-28 aspect-16/10 rounded-xl overflow-hidden border-2 transition ${
                currentIndex === idx
                  ? 'border-slate-900 ring-2 ring-slate-900/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={displayImages[currentIndex]}
            alt={title}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="flex items-center gap-4 mt-4 text-white text-sm">
            <button
              type="button"
              onClick={prevImage}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl"
            >
              Previous
            </button>
            <span>
              {currentIndex + 1} of {displayImages.length}
            </span>
            <button
              type="button"
              onClick={nextImage}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
