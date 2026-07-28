import React from 'react';
import { Product } from '../types';
import { ProductCard3D } from './ProductCard3D';

interface ProductsSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onCallProduct: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onResetFilter?: () => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onAddToCart,
  onCallProduct,
  onViewDetails,
}) => {
  // Format price with DA currency format (e.g., DA 108,000)
  const formatPriceDA = (price: number) => {
    return `DA ${price.toLocaleString('en-US')}`;
  };

  return (
    <section id="products-section" className="w-full bg-[#FAF8F5] pt-2 pb-10 px-4 sm:px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1A17] tracking-tight mb-2">
            أحدث المنتجات
          </h2>
          {/* Diamond motif divider */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-[1px] bg-[#C5A059]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#C5A059]" />
            <div className="w-12 h-[1px] bg-[#C5A059]" />
          </div>
        </div>

        {/* 2-Column Grid with 3D Depth matching Screenshots */}
        <div 
          className="grid grid-cols-2 gap-3 sm:gap-4.5 w-full max-w-md mx-auto"
        >
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard3D
                product={product}
                onAddToCart={onAddToCart}
                onCallProduct={onCallProduct}
                onViewDetails={onViewDetails}
                formatPriceDA={formatPriceDA}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



