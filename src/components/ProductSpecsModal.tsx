import React, { useEffect } from 'react';
import { X, ShoppingCart, Phone } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductSpecsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onCallProduct: (product: Product) => void;
}

export const ProductSpecsModal: React.FC<ProductSpecsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onCallProduct,
}) => {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [product]);

  if (!product) return null;

  const formatPriceDA = (price: number) => {
    return `DA ${price.toLocaleString('en-US')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0 }}
        className="relative w-[90%] max-w-[320px] bg-[#FAF8F5] rounded-3xl shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="w-full h-36 sm:h-44 bg-[#1A1816] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-[#C5A059]/20 pointer-events-none" />
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover relative z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Details Section */}
        <div className="p-4">
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#F5EBD7] text-[#8A6A29] text-[9px] font-bold border border-[#E2CE9F]">
                {product.series}
              </span>
              <div className="text-[14px] sm:text-[15px] font-black text-[#A17C38] tracking-tight">
                {formatPriceDA(product.priceDA)}
              </div>
            </div>
            <h2 className="text-[15px] sm:text-base font-bold font-serif text-[#1F1A17] leading-tight mt-1">
              {product.title}
            </h2>
          </div>

          {/* Description & Specs */}
          <div className="bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-2.5 mb-4 shadow-sm">
            <p className="text-[11px] text-[#4A3F35] leading-relaxed mb-2.5">
              {product.description}
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px]">
              <div className="flex flex-col bg-[#F7F2E8] p-1.5 rounded-lg border border-[#EAD8B1]/50">
                <span className="text-[#8A6A29] font-bold mb-0.5">الحالة</span>
                <span className="text-[#2A231C]">أصلي 100%</span>
              </div>
              <div className="flex flex-col bg-[#F7F2E8] p-1.5 rounded-lg border border-[#EAD8B1]/50">
                <span className="text-[#8A6A29] font-bold mb-0.5">الضمان</span>
                <span className="text-[#2A231C]">ضمان 12 شهر</span>
              </div>
              <div className="flex flex-col bg-[#F7F2E8] p-1.5 rounded-lg border border-[#EAD8B1]/50">
                <span className="text-[#8A6A29] font-bold mb-0.5">التوصيل</span>
                <span className="text-[#2A231C]">58 ولاية</span>
              </div>
              <div className="flex flex-col bg-[#F7F2E8] p-1.5 rounded-lg border border-[#EAD8B1]/50">
                <span className="text-[#8A6A29] font-bold mb-0.5">التوفر</span>
                <span className="text-[#1E7E43] font-bold">
                  {product.inStock ? 'في المخزون' : 'غير متوفر'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 mt-auto">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 bg-[#1C1713] text-[#F3E3C3] py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-sm font-bold shadow-md hover:bg-[#2A231C] transition-colors border border-[#C5A059]/30"
            >
              <ShoppingCart className="w-4 h-4 text-[#E6C280]" />
              إضافة للسلة
            </button>
            <button
              onClick={() => {
                onCallProduct(product);
                onClose();
              }}
              className="flex-1 bg-[#E6F4EA] border border-[#A8DABC] text-[#1E7E43] py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-sm font-bold shadow-sm hover:bg-[#D4EDDA] transition-colors"
            >
              <Phone className="w-4 h-4" />
              طلب عبر الهاتف
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
