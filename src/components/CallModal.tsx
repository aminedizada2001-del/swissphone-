import React from 'react';
import { X, Phone, MessageSquare, MapPin, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface CallModalProps {
  product: Product | null;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const phoneNum = '+213550580105';
  const displayPhone = '0550 58 01 05';

  const formatPriceDA = (price: number) => {
    return `DA ${price.toLocaleString('en-US')}`;
  };

  const handleWhatsAppProduct = () => {
    const text = encodeURIComponent(
      `Bonjour Swiss Phone, je souhaite avoir plus d'informations ou commander l'article : ${product.title} (${product.series}) au prix de ${formatPriceDA(product.priceDA)}.`
    );
    window.open(`https://wa.me/213550560105?text=${text}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0 }}
        className="bg-[#FAF8F5] border-2 border-[#C5A059] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
      >
        {/* Modal Header */}
        <div className="bg-[#1C1713] p-5 text-[#F3E3C3] flex items-center justify-between border-b border-[#C5A059]/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
            <h3 className="font-serif font-bold text-base sm:text-lg">
              Commander Chez Swiss Phone
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#F3E3C3] flex items-center justify-center transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-[#23201D] mx-auto mb-4 overflow-hidden border border-[#C5A059]/50 shadow-md">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h4 className="text-xl font-bold font-serif text-[#1F1A17] mb-1">
            {product.title}
          </h4>
          <p className="text-sm font-semibold text-[#8C6B28] mb-2">
            {product.series}
          </p>
          <div className="text-2xl font-black text-[#A17C38] mb-6">
            {formatPriceDA(product.priceDA)}
          </div>

          <p className="text-xs text-[#6B5A4B] mb-6 leading-relaxed">
            Contactez notre équipe de vente directe à Alger pour vérifier la disponibilité et fixer la livraison immédiate.
          </p>

          <div className="space-y-3">
            <a
              href={`tel:${phoneNum}`}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1C1713] text-[#F3E3C3] font-bold flex items-center justify-center gap-3 border border-[#C5A059] hover:bg-[#2A231C] transition-all shadow-md"
            >
              <Phone className="w-5 h-5 text-[#C5A059]" />
              Appeler Directement ({displayPhone})
            </a>

            <button
              onClick={handleWhatsAppProduct}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-3 hover:bg-[#20BD5A] transition-all shadow-md"
            >
              <MessageSquare className="w-5 h-5" />
              Commander sur WhatsApp
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAD8B1] flex items-center justify-center gap-2 text-xs text-[#8C7A6B]">
            <MapPin className="w-4 h-4 text-[#C5A059]" />
            <span>Boutique de Luxe - Au Cœur d'Alger</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
