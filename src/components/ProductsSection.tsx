import React from 'react';
import { Product } from '../types';
import { ProductCard3D } from './ProductCard3D';
import { motion } from 'motion/react';

interface ProductsSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onCallProduct: (product: Product) => void;
  onViewDetails: (product: Product) => void;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="products-section" className="w-full bg-[#FAF8F5] pt-2 pb-10 px-4 sm:px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
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

        {/* 2-Column Grid with 3D Depth matching Screenshots 2 & 3 */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 gap-3 sm:gap-4.5 w-full max-w-md mx-auto"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard3D
                product={product}
                onAddToCart={onAddToCart}
                onCallProduct={onCallProduct}
                onViewDetails={onViewDetails}
                formatPriceDA={formatPriceDA}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

