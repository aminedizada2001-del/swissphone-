import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { goldIphoneImg, airpodsImg, leatherCasesImg } from '../data/products';

export const CollectionSection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [tileTilt, setTileTilt] = useState<{ [key: number]: { rx: number; ry: number } }>({});

  const collectionItems = [
    { id: 1, img: goldIphoneImg, alt: 'Édition iPhone Or Soie' },
    { id: 2, img: airpodsImg, alt: 'AirPods Pro & Stylo Exécutif' },
    { id: 3, img: leatherCasesImg, alt: 'Gamme Étuis Cuir Véritable' },
    { id: 4, img: goldIphoneImg, alt: 'Finition Or Luxe' },
    { id: 5, img: airpodsImg, alt: 'Écrin Audio & Accessoire' },
    { id: 6, img: leatherCasesImg, alt: 'Artisanat Cuir MagSafe' },
  ];

  const handleMouseMove = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 12;
    setTileTilt((prev) => ({ ...prev, [id]: { rx, ry } }));
  };

  const handleMouseLeave = (id: number) => {
    setTileTilt((prev) => ({ ...prev, [id]: { rx: 0, ry: 0 } }));
  };

  return (
    <section className="w-full bg-[#FAF8F5] pb-1 sm:pb-2 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-1 sm:mb-2">
          <h2 className="text-base sm:text-lg md:text-xl font-serif font-bold text-[#2A231C] tracking-wide mb-1.5">
            La Collection
          </h2>
          <div className="w-20 h-[1.5px] bg-[#C5A059] mx-auto" />
        </div>

        {/* 6 Tile Gallery Grid with 3D Depth matching screenshot layout */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5" style={{ perspective: '1000px' }}>
          {collectionItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item.img)}
              onMouseMove={(e) => handleMouseMove(item.id, e)}
              onMouseLeave={() => handleMouseLeave(item.id)}
              style={{
                transform: `rotateX(${tileTilt[item.id]?.rx || 0}deg) rotateY(${tileTilt[item.id]?.ry || 0}deg)`,
                transformStyle: 'preserve-3d',
                transition: tileTilt[item.id]?.rx === 0 ? 'transform 0.5s ease' : 'none',
              }}
              className="group relative cursor-pointer aspect-square sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8DCBF] bg-[#F3EFEA] shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={item.img}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ transform: 'translateZ(10px)' }}
                referrerPolicy="no-referrer"
              />
              <div
                className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                style={{ transform: 'translateZ(20px)' }}
              >
                <ZoomIn className="w-6 h-6 text-[#F3E3C3] drop-shadow-lg scale-110" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl">
            <button
              onClick={() => setActiveImage(null)}
              aria-label="Fermer la vue"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeImage}
              alt="Aperçu Collection"
              className="w-full h-full object-contain bg-black"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};

