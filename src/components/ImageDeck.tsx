import React, { useEffect, useRef } from 'react';

interface ImageDeckProps {
  images: string[];
  autoScrollInterval?: number; // Interval in milliseconds for auto-scrolling
}

const ImageDeck: React.FC<ImageDeckProps> = ({ images, autoScrollInterval = 3000 }) => {
  const deckRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const startAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }

      scrollIntervalRef.current = window.setInterval(() => {
        if (deckRef.current) {
          const { scrollLeft, clientWidth, scrollWidth } = deckRef.current;
          const isAtEnd = scrollLeft + clientWidth >= scrollWidth;

          if (isAtEnd) {
            deckRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            deckRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
          }
        }
      }, autoScrollInterval);
    };

    startAutoScroll();

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [autoScrollInterval]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={deckRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide h-full"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {images.map((src, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full h-full"
            style={{ scrollSnapAlign: 'start' }}
          >
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDeck;
