import React from 'react';
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
  return (
    <div
      className="w-full"
      onClick={() => onViewDetails(product)}
    >
      <div
        className="rounded-tl-[44px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[44px] shadow-[0_10px_30px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col justify-between relative group cursor-pointer border border-[#EAD8B1]"
      >
        <div
          className="w-full h-40 sm:h-48 bg-[#1A1816] relative flex items-center justify-center overflow-hidden rounded-tl-[42px] rounded-tr-[16px] shadow-inner"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-[#C5A059]/20 pointer-events-none" />
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div
          className="p-3 sm:p-4 flex flex-col items-center text-center flex-grow bg-white"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#F5EBD7] text-[#8A6A29] text-[11px] font-bold mb-2 border border-[#E2CE9F] whitespace-nowrap shadow-xs">
            {product.series}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-[#1F1A17] mb-1.5 font-serif line-clamp-1">
            {product.title}
          </h3>
          <div className="text-base sm:text-lg font-black text-[#A17C38] tracking-tight mb-4 drop-shadow-xs">
            {formatPriceDA(product.priceDA)}
          </div>
          <div
            className="w-full flex items-center justify-center gap-2.5 pt-1"
          >
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
