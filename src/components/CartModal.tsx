import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, PhoneCall, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  cartItems: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  cartItems,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const totalDA = cartItems.reduce(
    (sum, item) => sum + item.product.priceDA * item.quantity,
    0
  );

  const formatPriceDA = (price: number) => {
    return `DA ${price.toLocaleString('en-US')}`;
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    let message = `Bonjour Swiss Phone Alger, je souhaite commander les articles suivants :\n\n`;
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.product.title} (${item.product.series}) x${
        item.quantity
      } - ${formatPriceDA(item.product.priceDA * item.quantity)}\n`;
    });
    message += `\n*Total : ${formatPriceDA(totalDA)}*\nMerci de me contacter pour la livraison à Alger.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/213550560105?text=${encoded}`, '_blank');
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
        >
          <div 
            className="w-full max-w-md bg-[#FAF8F5] h-full flex flex-col shadow-2xl border-l border-[#C5A059]/40"
          >
            {/* Header */}
            <div className="p-5 bg-[#1C1713] text-[#F3E3C3] flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#C5A059]" />
                <h3 className="text-lg font-serif font-bold tracking-wide">
                  Votre Panier Swiss Phone
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

            {/* Cart Body */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-[#6B5A4B] py-12">
                  <ShoppingBag className="w-16 h-16 text-[#C5A059]/50 mb-3" />
                  <p className="text-base font-serif font-semibold text-[#2A231C]">
                    Votre panier est vide
                  </p>
                  <p className="text-xs text-[#8C7A6B] max-w-xs mt-1">
                    Explorez notre collection d'iPhones et smartphones certifiés pour ajouter vos articles.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-[#FFFDF9] border border-[#EAD8B1] rounded-2xl p-4 flex gap-3 items-center shadow-sm"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-xl bg-[#23201D]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-grow">
                      <h4 className="font-serif font-bold text-[#1F1A17] text-sm">
                        {item.product.title}
                      </h4>
                      <p className="text-xs text-[#8C6B28] font-semibold mb-1">
                        {formatPriceDA(item.product.priceDA)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded bg-[#F5EBD7] text-[#1F1A17] font-bold flex items-center justify-center hover:bg-[#EAD8B1]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded bg-[#F5EBD7] text-[#1F1A17] font-bold flex items-center justify-center hover:bg-[#EAD8B1]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-red-400 hover:text-red-600 p-2"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 bg-[#FFFDF9] border-t border-[#EAD8B1] space-y-3">
                <div className="flex justify-between items-center text-sm font-semibold text-[#6B5A4B]">
                  <span>Total :</span>
                  <span className="text-xl font-black text-[#A17C38]">
                    {formatPriceDA(totalDA)}
                  </span>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors shadow-md"
                >
                  <PhoneCall className="w-5 h-5" />
                  Commander sur WhatsApp
                </button>

                <button
                  onClick={onClearCart}
                  className="w-full text-center text-xs text-[#8C7A6B] hover:underline pt-1"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
