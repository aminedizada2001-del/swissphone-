import React, { useState, useRef } from 'react';
import { Phone, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCard3DProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onCallProduct: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  formatPriceDA: (price: number) => string;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  onAddToCart,
  onCallProduct,
  onViewDetails,
  formatPriceDA,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angle (max 15 deg)
    const rX = ((y - centerY) / centerY) * -12;
    const rY = ((x - centerX) / centerX) * 12;

    setRotateX(rX);
    setRotateY(rY);

    // Glare position percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !e.touches[0]) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.3,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      className="perspective-1000 w-full"
      style={{ perspective: '1000px' }}
      onClick={() => onViewDetails(product)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0px)`,
          transformStyle: 'preserve-3d',
          transition: rotateX === 0 && rotateY === 0 ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
        }}
        className="animated-golden-border rounded-tl-[44px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[44px] shadow-[0_10px_30px_rgba(197,160,89,0.15)] hover:shadow-[0_20px_40px_rgba(197,160,89,0.25)] overflow-hidden flex flex-col justify-between transition-shadow duration-300 relative group cursor-pointer"
      >
        {/* Dynamic 3D Glare Light Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-tl-[44px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[44px]"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 235, 180, 0.6) 0%, rgba(255, 255, 255, 0) 60%)`,
          }}
        />

        {/* 3D Dark Studio Box with Pop-Out Image */}
        <div
          className="w-full h-40 sm:h-48 bg-[#1A1816] relative flex items-center justify-center overflow-hidden rounded-tl-[42px] rounded-tr-[16px] shadow-inner"
          style={{ transform: 'translateZ(15px)', transformStyle: 'preserve-3d' }}
        >
          {/* Subtle 3D Depth Light Ring */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-[#C5A059]/20 pointer-events-none" />

          {/* 3D Phone Image with Floating Elevation */}
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
            style={{
              transform: 'translateZ(25px)',
              filter: 'drop-shadow(0 12px 18px rgba(0, 0, 0, 0.7))',
            }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Info Section with 3D Elevation */}
        <div
          className="p-3 sm:p-4 flex flex-col items-center text-center flex-grow"
          style={{ transform: 'translateZ(20px)' }}
        >
          {/* Series Golden Badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-[#F5EBD7] text-[#8A6A29] text-[11px] font-bold mb-2 border border-[#E2CE9F] whitespace-nowrap shadow-xs">
            {product.series}
          </span>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-bold text-[#1F1A17] mb-1.5 font-serif line-clamp-1">
            {product.title}
          </h3>

          {/* Price Display with 3D Glow */}
          <div className="text-base sm:text-lg font-black text-[#A17C38] tracking-tight mb-4 drop-shadow-xs">
            {formatPriceDA(product.priceDA)}
          </div>

          {/* Bottom Dual Action Buttons with 3D Pop */}
          <div
            className="w-full flex items-center justify-center gap-2.5 pt-1"
            style={{ transform: 'translateZ(30px)' }}
          >
            {/* Phone / WhatsApp Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCallProduct(product);
              }}
              className="w-10 h-10 rounded-xl bg-[#E6F4EA] border border-[#A8DABC] text-[#1E7E43] flex items-center justify-center hover:bg-[#D4EDDA] active:scale-90 transition-all shadow-sm hover:shadow-md"
              title="الطلب عبر واتساب"
              aria-label="الطلب عبر واتساب"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-10 h-10 rounded-xl bg-[#1C1713] text-[#F3E3C3] flex items-center justify-center hover:bg-[#2A231C] active:scale-90 transition-all shadow-sm hover:shadow-md border border-[#C5A059]"
              title="Ajouter au panier"
              aria-label="Ajouter au panier"
            >
              <ShoppingCart className="w-4 h-4 text-[#E6C280]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
