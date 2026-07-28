import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, X, MapPin, Instagram } from 'lucide-react';
import exactHeroMatchImg from '../assets/images/swiss_phone_hero_exact_match_1785069510478.jpg';
import { subscribeSettings } from '../lib/storeService';
import { InstagramModal } from './InstagramModal';

interface HeroSectionProps {
  cartCount: number;
  onOpenCart: () => void;
  onScrollToProducts: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  cartCount,
  onOpenCart,
  onScrollToProducts,
}) => {
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [heroBannerImg, setHeroBannerImg] = useState<string>(exactHeroMatchImg);
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: '213550560105',
    googleMaps: 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86',
    instagram: 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4',
    instagram2: 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq',
    tiktok: 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9'
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.landingImages?.heroBanner) {
          setHeroBannerImg(parsed.landingImages.heroBanner);
        }
        if (parsed.socialLinks) {
          if (!parsed.socialLinks.whatsapp || parsed.socialLinks.whatsapp === '213550580105') {
            parsed.socialLinks.whatsapp = '213550560105';
          }
          setSocialLinks(prev => ({ ...prev, ...parsed.socialLinks }));
        }
      } catch (e) {
        console.error(e);
      }
    }

    const unsubscribe = subscribeSettings((remoteSettings) => {
      if (remoteSettings) {
        if (remoteSettings.landingImages?.heroBanner) {
          setHeroBannerImg(remoteSettings.landingImages.heroBanner);
        }
        if (remoteSettings.socialLinks) {
          setSocialLinks({
            whatsapp: (!remoteSettings.socialLinks.whatsapp || remoteSettings.socialLinks.whatsapp === '213550580105') ? '213550560105' : remoteSettings.socialLinks.whatsapp,
            googleMaps: remoteSettings.socialLinks.googleMaps || 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86',
            instagram: (!remoteSettings.socialLinks.instagram || remoteSettings.socialLinks.instagram === 'https://instagram.com') ? 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4' : remoteSettings.socialLinks.instagram,
            instagram2: remoteSettings.socialLinks.instagram2 || 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq',
            tiktok: (!remoteSettings.socialLinks.tiktok || remoteSettings.socialLinks.tiktok === 'https://tiktok.com' || remoteSettings.socialLinks.tiktok === 'https://www.tiktok.com/@abdou.swissphone') ? 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9' : remoteSettings.socialLinks.tiktok
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const getTiktokUrl = (url: string) => {
    if (!url) return 'https://www.tiktok.com/@abdou.swissphone';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('@')) return `https://www.tiktok.com/${url}`;
    return `https://www.tiktok.com/@${url}`;
  };

  return (
    <header className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1] max-h-[300px] bg-[#0E1511] text-white flex flex-col justify-between shadow-2xl z-40">
      {/* Background Exact Match Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroBannerImg}
          alt="SWISS PHONE Header Banner"
          decoding="async"
          className="w-full h-full object-cover object-center brightness-105 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top Right Floating Controls Stack */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-2.5">
        <button
          onClick={() => setIsSocialOpen(!isSocialOpen)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D1AC66]/20 backdrop-blur-md border border-[#D1AC66]/40 shadow-lg flex items-center justify-center text-[#D1AC66] hover:bg-[#D1AC66]/30 hover:scale-105 active:scale-95 transition-all"
          title="Réseaux Sociaux"
        >
          {isSocialOpen ? (
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>

        <div
          className={`flex flex-col items-center gap-2.5 transition-all duration-300 origin-top overflow-hidden ${
            isSocialOpen ? 'max-h-[320px] opacity-100 scale-100 mb-1' : 'max-h-0 opacity-0 scale-90 mb-0'
          }`}
        >
          <a
            href={`https://wa.me/${socialLinks.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#D1AC66]/60 shadow-lg flex items-center justify-center hover:bg-[#1A1A1A] hover:scale-105 active:scale-95 transition-all"
            title="WhatsApp"
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-[#25D366] w-4 h-4 sm:w-5 sm:h-5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </a>

          <button
            onClick={() => setIsInstagramModalOpen(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#D1AC66]/60 shadow-lg flex items-center justify-center hover:bg-[#1A1A1A] hover:scale-105 active:scale-95 transition-all"
            title="حسابات إنستغرام"
            aria-label="Instagram"
          >
            <Instagram className="text-[#E1306C] w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <a
            href={getTiktokUrl(socialLinks.tiktok)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#D1AC66]/60 shadow-lg flex items-center justify-center hover:bg-[#1A1A1A] hover:scale-105 active:scale-95 transition-all"
            title="TikTok (@abdou.swissphone)"
          >
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-white w-4 h-4 sm:w-5 sm:h-5">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </a>

          <a
            href={socialLinks.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#D1AC66]/60 shadow-lg flex items-center justify-center hover:bg-[#1A1A1A] hover:scale-105 active:scale-95 transition-all"
            title="Google Maps"
          >
            <MapPin className="text-[#4285F4] w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </div>

        <button
          onClick={onOpenCart}
          className="relative -mt-1 sm:-mt-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#D1AC66]/20 backdrop-blur-md border border-[#D1AC66]/40 shadow-lg flex items-center justify-center text-[#D1AC66] hover:bg-[#D1AC66]/30 hover:scale-105 active:scale-95 transition-all"
          title="Mon Panier"
          aria-label="Mon Panier"
        >
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          {cartCount > 0 && (
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-black text-[#D1AC66] text-[9px] sm:text-[10px] font-bold flex items-center justify-center shadow-md border border-[#D1AC66]/40">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <InstagramModal 
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        account1={socialLinks.instagram}
        account2={socialLinks.instagram2}
      />
    </header>
  );
};






