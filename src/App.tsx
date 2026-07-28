import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from './components/HeroSection';
import { AuthenticitySection } from './components/AuthenticitySection';
import { CollectionSection } from './components/CollectionSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductsSection } from './components/ProductsSection';
import { RepairServicesSection } from './components/RepairServicesSection';
import { CartModal } from './components/CartModal';
import { CallModal } from './components/CallModal';
import { ProductSpecsModal } from './components/ProductSpecsModal';
import { StoreInfoSection } from './components/StoreInfoSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useStoreData } from './hooks/useStoreData';
import { PRODUCTS as DEFAULT_PRODUCTS } from './data/products';
import { Product, CartItem } from './types';
import { Check } from 'lucide-react';

export default function App() {
  const { products, services, saveProducts, saveServices } = useStoreData();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedCallProduct, setSelectedCallProduct] = useState<Product | null>(null);
  const [selectedDetailsProduct, setSelectedDetailsProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  // Cart total items count
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // Show temporary toast
    setToastMessage(`Ajouté au panier : ${product.title}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCallProduct = (product: Product) => {
    let waNum = '213550560105';
    try {
      const saved = localStorage.getItem('siteSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.socialLinks?.whatsapp) {
          const clean = parsed.socialLinks.whatsapp.replace(/\D/g, '');
          if (clean) waNum = clean;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const priceFormatted = `DA ${product.priceDA.toLocaleString('en-US')}`;
    const message = encodeURIComponent(
      `مرحباً Swiss Phone، أود طلب أو الاستفسار عن المنتج: ${product.title} (${product.series}) - السعر: ${priceFormatted}`
    );
    window.open(`https://wa.me/${waNum}?text=${message}`, '_blank');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleScrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  };

  if (isAdminLoggedIn) {
    return (
      <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} transition={{ duration: 0 }}>
        <AdminDashboard
          products={products}
          services={services}
          onSaveProducts={saveProducts}
          onSaveServices={saveServices}
          onLogout={() => setIsAdminLoggedIn(false)}
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-[#1F1A17] font-sans antialiased selection:bg-[#C5A059] selection:text-white flex justify-center">
      {/* Toast notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ duration: 0 }}
            className="fixed top-5 left-1/2 z-50 bg-[#1C1713] text-[#F3E3C3] border border-[#C5A059] py-2.5 px-5 rounded-full shadow-2xl flex items-center gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-[#C5A059] text-black flex items-center justify-center font-bold text-xs">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page Layout matching screenshots */}
      <motion.main 
        initial={{ opacity: 1, y: 0 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0 }}
        className="w-full max-w-[440px] bg-[#FAF8F5] shadow-2xl shadow-black/40 overflow-hidden min-h-screen relative"
      >
        {/* 1. Hero Section */}
        <HeroSection
          cartCount={cartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onScrollToProducts={handleScrollToProducts}
        />

        {/* 2. Authenticity Section */}
        <AuthenticitySection />

        {/* 3. Collection Gallery Section */}
        <CollectionSection />

        {/* 4. Main Category Filter Section (Arabic RTL) */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={(catId) => setActiveCategory(catId)}
        />

        {/* 5. Products Section (Arabic RTL) */}
        <ProductsSection
          products={filteredProducts}
          onAddToCart={handleAddToCart}
          onCallProduct={handleCallProduct}
          onViewDetails={(product) => setSelectedDetailsProduct(product)}
        />

        {/* 6. Repair Services Section */}
        <RepairServicesSection services={services} />

        {/* Store Information Section */}
        <StoreInfoSection />

        {/* 7. Footer */}
        <Footer onOpenAdmin={() => setShowAdminLogin(true)} />
      </motion.main>

      {/* Cart Drawer Modal */}
      <CartModal
        isOpen={isCartOpen}
        cartItems={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Phone Call / Order Modal */}
      <AnimatePresence>
        {selectedCallProduct && (
          <CallModal
            product={selectedCallProduct}
            onClose={() => setSelectedCallProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* Product Specs / Details Modal */}
      <AnimatePresence>
        {selectedDetailsProduct && (
          <ProductSpecsModal
            product={selectedDetailsProduct}
            onClose={() => setSelectedDetailsProduct(null)}
            onAddToCart={handleAddToCart}
            onCallProduct={handleCallProduct}
          />
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLogin
            onLogin={() => {
              setShowAdminLogin(false);
              setIsAdminLoggedIn(true);
            }}
            onCancel={() => setShowAdminLogin(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
