import React, { useState, useEffect } from 'react';
import { Product, RepairService } from '../types';
import { Plus, Edit2, Trash2, X, Save, LogOut, Package, Wrench, Image as ImageIcon, Check, ChevronDown, Store, Key, Share2, Search, Copy, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { syncSettingsToFirebase, subscribeSettings } from '../lib/storeService';

interface AdminDashboardProps {
  products: Product[];
  services: RepairService[];
  onSaveProducts: (products: Product[], removedId?: string) => void;
  onSaveServices: (services: RepairService[], removedId?: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  services,
  onSaveProducts,
  onSaveServices,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'settings'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingService, setEditingService] = useState<RepairService | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Settings State
  const [storeInfo, setStoreInfo] = useState({
    address: '12 شارع ديدوش مراد، الجزائر الوسطى.',
    phone: '0550 58 01 05',
    email: 'contact@swissphone-dz.com'
  });
  const [adminPassword, setAdminPassword] = useState('1234');
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: '213550560105',
    googleMaps: 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86',
    instagram: 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4',
    instagram2: 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq',
    tiktok: 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9'
  });

  const [openSections, setOpenSections] = useState({
    store: false,
    password: false,
    social: false
  });

  const toggleSection = (key: 'store' | 'password' | 'social') => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- Handlers for Products ---
  const handleEditProduct = (product: Product) => setEditingProduct(product);
  
  const handleToggleStock = (product: Product) => {
    const updated = { ...product, inStock: !product.inStock };
    onSaveProducts(products.map(p => p.id === product.id ? updated : p));
  };

  const handleDuplicateProduct = (product: Product) => {
    const duplicated: Product = {
      ...product,
      id: Date.now().toString(),
      title: `${product.title} (نسخة)`
    };
    onSaveProducts([duplicated, ...products]);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      onSaveProducts(products.filter(p => p.id !== id), id);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct({
      id: Date.now().toString(),
      title: '',
      series: '',
      category: 'accessories',
      priceDA: 0,
      image: '',
      description: '',
      inStock: true
    });
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const existing = products.find(p => p.id === editingProduct.id);
    if (existing) {
      onSaveProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    } else {
      onSaveProducts([editingProduct, ...products]);
    }
    setEditingProduct(null);
  };

  // Compressed Image Upload Handler (Canvas optimization)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setEditingProduct(prev => prev ? { ...prev, image: compressedDataUrl } : null);
        }
        setIsUploadingImage(false);
      };
      img.onerror = () => setIsUploadingImage(false);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // --- Handlers for Services ---
  const handleEditService = (service: RepairService) => setEditingService(service);
  const handleDeleteService = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
      onSaveServices(services.filter(s => s.id !== id), id);
    }
  };
  const handleAddService = () => {
    setEditingService({
      id: Date.now().toString(),
      title: '',
      iconName: 'Wrench',
      time: '',
      price: ''
    });
  };

  const saveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const existing = services.find(s => s.id === editingService.id);
    if (existing) {
      onSaveServices(services.map(s => s.id === editingService.id ? editingService : s));
    } else {
      onSaveServices([...services, editingService]);
    }
    setEditingService(null);
  };

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      try {
        const { storeInfo: sInfo, adminPassword: aPass, socialLinks: sLinks } = JSON.parse(saved);
        if (sInfo) {
          if (!sInfo.phone || sInfo.phone.includes('779')) sInfo.phone = '0550 58 01 05';
          setStoreInfo(sInfo);
        }
        if (aPass) setAdminPassword(aPass);
        if (sLinks) {
          if (!sLinks.whatsapp || sLinks.whatsapp === '213550580105') {
            sLinks.whatsapp = '213550560105';
          }
          if (!sLinks.tiktok || sLinks.tiktok === 'https://tiktok.com' || sLinks.tiktok === 'https://www.tiktok.com/@abdou.swissphone') {
            sLinks.tiktok = 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9';
          }
          if (!sLinks.instagram || sLinks.instagram === 'https://instagram.com') {
            sLinks.instagram = 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4';
          }
          if (!sLinks.instagram2) {
            sLinks.instagram2 = 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq';
          }
          setSocialLinks(sLinks);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const unsubscribe = subscribeSettings((remoteSettings) => {
      if (remoteSettings) {
        if (remoteSettings.storeInfo) {
          const info = { ...remoteSettings.storeInfo };
          if (!info.phone || info.phone.includes('779')) info.phone = '0550 58 01 05';
          setStoreInfo(info);
        }
        if (remoteSettings.adminPassword) setAdminPassword(remoteSettings.adminPassword);
        if (remoteSettings.socialLinks) {
          const s = { ...remoteSettings.socialLinks };
          if (!s.whatsapp || s.whatsapp === '213550580105') {
            s.whatsapp = '213550560105';
          }
          if (!s.tiktok || s.tiktok === 'https://tiktok.com' || s.tiktok === 'https://www.tiktok.com/@abdou.swissphone') {
            s.tiktok = 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9';
          }
          if (!s.instagram || s.instagram === 'https://instagram.com') {
            s.instagram = 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4';
          }
          if (!s.instagram2) {
            s.instagram2 = 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq';
          }
          setSocialLinks(s);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const saveSettings = () => {
    const data = { storeInfo, adminPassword, socialLinks };
    localStorage.setItem('siteSettings', JSON.stringify(data));
    syncSettingsToFirebase(data);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div className="w-full mx-auto max-w-[440px] bg-[#FAF8F5] min-h-screen pb-20 shadow-2xl border-x border-[#EAD8B1]/40" dir="rtl">
      {/* Header */}
      <div className="bg-[#1C1713] p-5 text-[#F3E3C3] flex items-center justify-between shadow-md sticky top-0 z-40">
        <div>
          <h1 className="font-bold font-serif text-xl sm:text-2xl text-[#E6C280] tracking-tight">لوحة التحكم</h1>
          <p className="text-[#A69382] text-xs font-medium mt-0.5 tracking-wider uppercase">SWISS PHONE ADMIN</p>
        </div>
        <button 
          onClick={onLogout} 
          className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all shadow-sm"
          title="تسجيل الخروج"
        >
          <LogOut className="w-5 h-5 text-[#C5A059]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-3 bg-[#FFFDF9] border-b border-[#EAD8B1]/50 shadow-sm sticky top-[76px] z-30">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'products' ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20' : 'bg-[#F7F2E8] text-[#8A6A29] hover:bg-[#EAD8B1]/40'
          }`}
        >
          <Package className="w-4 h-4" />
          المنتجات
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'services' ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20' : 'bg-[#F7F2E8] text-[#8A6A29] hover:bg-[#EAD8B1]/40'
          }`}
        >
          <Wrench className="w-4 h-4" />
          الخدمات
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'settings' ? 'bg-[#C5A059] text-white shadow-md shadow-[#C5A059]/20' : 'bg-[#F7F2E8] text-[#8A6A29] hover:bg-[#EAD8B1]/40'
          }`}
        >
          <Package className="w-4 h-4" />
          الإعدادات
        </motion.button>
      </div>

      {/* Content Area */}
      <div className="p-4 space-y-4">
        {/* Search Bar for fast filtering */}
        {(activeTab === 'products' || activeTab === 'services') && (
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A6A29] absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'products' ? "بحث سريع عن منتج..." : "بحث عن خدمة..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl pr-10 pl-4 py-2.5 text-xs text-[#1F1A17] focus:outline-none focus:border-[#C5A059] shadow-sm placeholder:text-[#A69382]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A69382] hover:text-[#1F1A17]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'products' && (
            <motion.div
              key="tab-products"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddProduct}
                className="w-full bg-[#1C1713] text-[#F3E3C3] py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:bg-[#2A231C] transition-colors border border-[#C5A059]/30 mb-4"
              >
                <Plus className="w-5 h-5 text-[#E6C280]" />
                إضافة منتج جديد
              </motion.button>

              <div className="flex flex-col gap-3">
                {products
                  .filter(p => !searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.series.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(p => (
                  <div key={p.id} className="bg-[#FFFDF9] p-3 rounded-2xl border border-[#EAD8B1] shadow-sm flex items-center gap-3 hover:shadow-md transition-all group">
                    <div className="w-16 h-16 bg-[#F7F2E8] rounded-xl overflow-hidden flex-shrink-0 border border-[#EAD8B1]/50 relative flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} className="w-full h-full object-cover" alt="" loading="lazy" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-[#C5A059]/40" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#1F1A17] line-clamp-1 font-serif">{p.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#A17C38] font-black tracking-tight">DA {p.priceDA.toLocaleString('en-US')}</span>
                        {/* 1-Click Fast Stock Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStock(p)}
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold transition-all active:scale-95 ${
                            p.inStock 
                              ? 'bg-[#E6F4EA] text-[#1E7E43] hover:bg-emerald-200' 
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                          title="اضغط للتغيير السريع لحالة التوفر"
                        >
                          {p.inStock ? 'متوفر ✓' : 'غير متوفر ✕'}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => handleDuplicateProduct(p)} 
                        className="p-2 bg-[#F7F2E8] rounded-lg text-[#8A6A29] hover:bg-[#EAD8B1] transition-colors"
                        title="نسخ المنتج"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => handleEditProduct(p)} 
                        className="p-2 bg-[#F7F2E8] rounded-lg text-[#8A6A29] hover:bg-[#EAD8B1] transition-colors"
                        title="تعديل"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.9 }} 
                        onClick={() => handleDeleteProduct(p.id)} 
                        className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="tab-services"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddService}
                className="w-full bg-[#1C1713] text-[#F3E3C3] py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:bg-[#2A231C] transition-colors border border-[#C5A059]/30 mb-4"
              >
                <Plus className="w-5 h-5 text-[#E6C280]" />
                إضافة خدمة جديدة
              </motion.button>
              <div className="flex flex-col gap-3">
                {services
                  .filter(s => !searchTerm || s.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(s => (
                  <div key={s.id} className="bg-[#FFFDF9] p-3 rounded-2xl border border-[#EAD8B1] shadow-sm flex items-center gap-3 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 bg-[#1C1713] rounded-xl flex items-center justify-center border border-[#C5A059]/20 flex-shrink-0">
                      <Wrench className="w-5 h-5 text-[#E6C280]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#1F1A17]">{s.title}</h3>
                      <div className="flex gap-2 mt-1 text-[10px] font-bold text-[#8A6A29]">
                        <span className="bg-[#F7F2E8] px-2 py-0.5 rounded-md border border-[#EAD8B1]/50">DA {s.price}</span>
                        <span className="bg-[#F7F2E8] px-2 py-0.5 rounded-md border border-[#EAD8B1]/50">{s.time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleEditService(s)} className="p-2 bg-[#F7F2E8] rounded-lg text-[#8A6A29] hover:bg-[#EAD8B1] transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDeleteService(s.id)} className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="space-y-3"
            >
            {/* 1. Store Info Accordion */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#EAD8B1] shadow-sm overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('store')}
                className="w-full p-4 flex items-center justify-between font-bold text-base text-[#1F1A17] hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F2E8] border border-[#EAD8B1] flex items-center justify-center text-[#C5A059]">
                    <Store className="w-4 h-4" />
                  </div>
                  <span>معلومات المحل</span>
                </div>
                <motion.div
                  animate={{ rotate: openSections.store ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#8A6A29]" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openSections.store && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-1 space-y-3 border-t border-[#EAD8B1]/40">
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">العنوان</label>
                        <input placeholder="العنوان" value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">الهاتف</label>
                        <input placeholder="الهاتف" value={storeInfo.phone} onChange={e => setStoreInfo({...storeInfo, phone: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">البريد الإلكتروني</label>
                        <input placeholder="البريد الإلكتروني" value={storeInfo.email} onChange={e => setStoreInfo({...storeInfo, email: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Admin Password Accordion */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#EAD8B1] shadow-sm overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('password')}
                className="w-full p-4 flex items-center justify-between font-bold text-base text-[#1F1A17] hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F2E8] border border-[#EAD8B1] flex items-center justify-center text-[#C5A059]">
                    <Key className="w-4 h-4" />
                  </div>
                  <span>كلمة سر الموقع</span>
                </div>
                <motion.div
                  animate={{ rotate: openSections.password ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#8A6A29]" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openSections.password && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-1 border-t border-[#EAD8B1]/40">
                      <label className="block text-xs font-semibold text-[#8A6A29] mb-1">كلمة السر الجديدة</label>
                      <input type="password" placeholder="كلمة السر..." value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Social & Maps Links Accordion */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#EAD8B1] shadow-sm overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => toggleSection('social')}
                className="w-full p-4 flex items-center justify-between font-bold text-base text-[#1F1A17] hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F7F2E8] border border-[#EAD8B1] flex items-center justify-center text-[#C5A059]">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <span>روابط التواصل والموقع</span>
                </div>
                <motion.div
                  animate={{ rotate: openSections.social ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-[#8A6A29]" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openSections.social && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-1 space-y-3 border-t border-[#EAD8B1]/40">
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">رقم الواتساب (بدون +)</label>
                        <input placeholder="رقم الواتساب (بدون +)" value={socialLinks.whatsapp} onChange={e => setSocialLinks({...socialLinks, whatsapp: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">رابط جوجل مابس</label>
                        <input placeholder="رابط جوجل مابس" value={socialLinks.googleMaps} onChange={e => setSocialLinks({...socialLinks, googleMaps: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">إنستغرام (الحساب الأول)</label>
                        <input placeholder="إنستغرام 1" value={socialLinks.instagram} onChange={e => setSocialLinks({...socialLinks, instagram: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">إنستغرام (الحساب الثاني)</label>
                        <input placeholder="إنستغرام 2" value={socialLinks.instagram2 || ''} onChange={e => setSocialLinks({...socialLinks, instagram2: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#8A6A29] mb-1">تيك توك</label>
                        <input placeholder="تيك توك" value={socialLinks.tiktok} onChange={e => setSocialLinks({...socialLinks, tiktok: e.target.value})} className="w-full bg-[#F7F2E8] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/50" dir="ltr" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveSettings}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden mt-4 ${
                isSaved 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-500/50' 
                  : 'bg-[#C5A059] text-white hover:bg-[#A17C38] shadow-[#C5A059]/30'
              }`}
            >
              <AnimatePresence mode="wait">
                {isSaved ? (
                  <motion.div
                    key="saved"
                    initial={{ scale: 0.6, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-5 h-5 text-white stroke-[3]" />
                    </motion.div>
                    <span>تم حفظ التغييرات بنجاح!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>حفظ كل التغييرات</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={saveProduct} className="bg-[#FAF8F5] rounded-[32px] w-full max-w-sm max-h-[90vh] overflow-y-auto p-5 sm:p-6 flex flex-col gap-4 shadow-2xl border border-[#EAD8B1]/50 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-2 pb-3 border-b border-[#EAD8B1]">
              <h3 className="font-bold text-xl font-serif text-[#1F1A17]">{editingProduct.id.length > 10 ? 'إضافة منتج' : 'تعديل منتج'}</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="p-1.5 bg-black/5 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5 text-[#1F1A17]" /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">الإسم</label>
                <input required placeholder="اسم المنتج..." value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">السلسلة</label>
                <input required placeholder="مثال: سلسلة iPhone 15" value={editingProduct.series} onChange={e => setEditingProduct({...editingProduct, series: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">السعر (DA)</label>
                <input required type="number" placeholder="0" value={editingProduct.priceDA || ''} onChange={e => setEditingProduct({...editingProduct, priceDA: parseInt(e.target.value) || 0})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">صورة المنتج</label>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input 
                      required 
                      placeholder="https://..." 
                      value={editingProduct.image} 
                      onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} 
                      className="flex-1 bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" 
                      dir="ltr" 
                    />
                    <label className="bg-[#1C1713] text-[#F3E3C3] hover:bg-[#2A231C] px-3.5 rounded-xl border border-[#C5A059]/30 flex items-center justify-center cursor-pointer transition-all active:scale-95 shrink-0 text-xs font-bold gap-1.5" title="رفع صورة من الجهاز">
                      <Upload className="w-4 h-4 text-[#E6C280]" />
                      <span>{isUploadingImage ? 'جاري الضغط...' : 'رفع'}</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={isUploadingImage} />
                    </label>
                  </div>
                  {editingProduct.image && (
                    <div className="w-16 h-16 rounded-xl border border-[#EAD8B1] overflow-hidden bg-black/5 mt-1 relative">
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">التصنيف</label>
                <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all appearance-none">
                  <option value="iphone13">سلسلة iPhone 13</option>
                  <option value="iphone14">سلسلة iPhone 14</option>
                  <option value="iphone15">سلسلة iPhone 15</option>
                  <option value="samsung">سلسلة Samsung</option>
                  <option value="xiaomi">سلسلة Xiaomi</option>
                  <option value="accessories">إكسسوارات</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">الوصف التفصيلي</label>
                <textarea placeholder="أدخل مواصفات المنتج..." value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all h-24 resize-none leading-relaxed" />
              </div>
              
              <label className="flex items-center gap-3 p-3 bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl cursor-pointer hover:bg-[#F7F2E8] transition-colors mt-2">
                <input type="checkbox" checked={editingProduct.inStock} onChange={e => setEditingProduct({...editingProduct, inStock: e.target.checked})} className="w-5 h-5 accent-[#C5A059] rounded" />
                <span className="text-sm font-bold text-[#1F1A17]">المنتج متوفر في المخزون</span>
              </label>
            </div>

            <button type="submit" className="w-full bg-[#1C1713] text-[#F3E3C3] py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg hover:bg-[#2A231C] active:scale-95 transition-all border border-[#C5A059]/30">
              <Save className="w-5 h-5 text-[#E6C280]" />
              حفظ التغييرات
            </button>
          </form>
        </div>
      )}

      {/* Service Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={saveService} className="bg-[#FAF8F5] rounded-[32px] w-full max-w-sm max-h-[90vh] overflow-y-auto p-5 sm:p-6 flex flex-col gap-4 shadow-2xl border border-[#EAD8B1]/50 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-2 pb-3 border-b border-[#EAD8B1]">
              <h3 className="font-bold text-xl font-serif text-[#1F1A17]">{editingService.id.length > 10 ? 'إضافة خدمة' : 'تعديل خدمة'}</h3>
              <button type="button" onClick={() => setEditingService(null)} className="p-1.5 bg-black/5 hover:bg-black/10 rounded-full transition-colors"><X className="w-5 h-5 text-[#1F1A17]" /></button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">عنوان الخدمة</label>
                <input required placeholder="مثال: تغيير الشاشة..." value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">الوقت المتوقع</label>
                <input required placeholder="مثال: 30 - 60 دقيقة" value={editingService.time} onChange={e => setEditingService({...editingService, time: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">السعر (DA)</label>
                <input required placeholder="مثال: يبدأ من 4,500" value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8A6A29] mb-1.5 px-1">أيقونة الخدمة (Lucide)</label>
                <select value={editingService.iconName} onChange={e => setEditingService({...editingService, iconName: e.target.value})} className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl p-3 text-sm focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all appearance-none" dir="ltr">
                  <option value="Smartphone">Smartphone (للشاشات / الهواتف)</option>
                  <option value="Battery">Battery (للبطاريات)</option>
                  <option value="Camera">Camera (للكاميرات)</option>
                  <option value="Cpu">Cpu (للوحة الأم / المعالج)</option>
                  <option value="Wifi">Wifi (للشبكة / الواي فاي)</option>
                  <option value="Volume2">Volume (للصوت / مكبر الصوت)</option>
                  <option value="Mic">Mic (للميكروفون)</option>
                  <option value="Droplet">Droplet (لتنظيف الماء / الأكسدة)</option>
                  <option value="Zap">Zap (لمنفذ الشحن / الكهرباء)</option>
                  <option value="ShieldCheck">ShieldCheck (للسوفتوير / الحماية)</option>
                  <option value="MonitorSmartphone">MonitorSmartphone (للزجاج الخلفي)</option>
                  <option value="Wrench">Wrench (صيانة عامة)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1C1713] text-[#F3E3C3] py-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg hover:bg-[#2A231C] active:scale-95 transition-all border border-[#C5A059]/30">
              <Save className="w-5 h-5 text-[#E6C280]" />
              حفظ التغييرات
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
