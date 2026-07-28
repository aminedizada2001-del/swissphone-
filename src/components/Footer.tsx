import React, { useState, useEffect } from 'react';
import { Instagram, Lock, Phone, MapPin } from 'lucide-react';
import { InstagramModal } from './InstagramModal';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    storeInfo: {
      address: 'الجزائر العاصمة، الجزائر (توصيل متوفر لـ 58 ولاية)',
      phone: '0550 58 01 05',
      email: 'contact@swissphone-dz.com'
    },
    socialLinks: {
      whatsapp: '213550560105',
      googleMaps: 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86',
      instagram: 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4',
      instagram2: 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq',
      tiktok: 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9'
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.socialLinks) {
          if (!parsed.socialLinks.whatsapp || parsed.socialLinks.whatsapp === '213550580105') {
            parsed.socialLinks.whatsapp = '213550560105';
          }
        }
        setSettings(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    let unsubscribe = () => {};
    import('../lib/storeService').then(({ subscribeSettings }) => {
      unsubscribe = subscribeSettings((remoteSettings) => {
      if (remoteSettings && remoteSettings.storeInfo) {
        setSettings({
          storeInfo: {
            address: remoteSettings.storeInfo.address || 'الجزائر العاصمة، الجزائر (توصيل متوفر لـ 58 ولاية)',
            phone: (!remoteSettings.storeInfo.phone || remoteSettings.storeInfo.phone.includes('779')) ? '0550 58 01 05' : remoteSettings.storeInfo.phone,
            email: remoteSettings.storeInfo.email || 'contact@swissphone-dz.com'
          },
          socialLinks: {
            whatsapp: (!remoteSettings.socialLinks?.whatsapp || remoteSettings.socialLinks.whatsapp === '213550580105') ? '213550560105' : remoteSettings.socialLinks.whatsapp,
            googleMaps: remoteSettings.socialLinks?.googleMaps || 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86',
            instagram: (!remoteSettings.socialLinks?.instagram || remoteSettings.socialLinks?.instagram === 'https://instagram.com') ? 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4' : remoteSettings.socialLinks.instagram,
            instagram2: remoteSettings.socialLinks?.instagram2 || 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq',
            tiktok: (!remoteSettings.socialLinks?.tiktok || remoteSettings.socialLinks?.tiktok === 'https://tiktok.com' || remoteSettings.socialLinks?.tiktok === 'https://www.tiktok.com/@abdou.swissphone') ? 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9' : remoteSettings.socialLinks.tiktok
          }
        });
      }
    });

    });
    return () => unsubscribe();
  }, []);

  const mapsUrl = (settings.socialLinks.googleMaps && settings.socialLinks.googleMaps !== '#')
    ? settings.socialLinks.googleMaps
    : 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86';

  const getTiktokUrl = (url: string) => {
    if (!url) return 'https://www.tiktok.com/@abdou.swissphone?_r=1&_t=ZS-98PuvrYXCk9';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('@')) return `https://www.tiktok.com/${url}`;
    return `https://www.tiktok.com/@${url}`;
  };

  return (
    <footer className="w-full bg-white text-[#6B5A4B] border-t border-[#EAD8B1] py-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-md mx-auto flex flex-col items-center text-center relative z-10 space-y-3">
        {/* Brand Name */}
        <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-[0.18em] text-[#1F1A17] uppercase">
          SWISS PHONE
        </h2>

        {/* Contact Info */}
        <div className="text-xs sm:text-sm text-[#8C7A6B] space-y-1 font-sans">
          <p className="font-mono text-[#A17C38] font-semibold">{settings.storeInfo.phone}</p>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="block hover:text-[#C5A059] transition-colors">
            {settings.storeInfo.address}
          </a>
        </div>

        {/* Social Links Icons */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EAD8B1] flex items-center justify-center text-[#8C7A6B] hover:text-[#EA4335] transition-colors"
            title="Google Maps"
            aria-label="Google Maps"
          >
            <MapPin className="w-3.5 h-3.5" />
          </a>
          <a
            href={`https://wa.me/${settings.socialLinks.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EAD8B1] flex items-center justify-center text-[#8C7A6B] hover:text-[#25D366] transition-colors"
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setIsInstagramModalOpen(true)}
            className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EAD8B1] flex items-center justify-center text-[#8C7A6B] hover:text-[#C5A059] transition-colors"
            title="حسابات إنستغرام"
            aria-label="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </button>
          <a
            href={getTiktokUrl(settings.socialLinks.tiktok)}
            target="_blank"
            rel="noreferrer"
            className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EAD8B1] flex items-center justify-center text-[#8C7A6B] hover:text-[#C5A059] transition-colors"
            title="TikTok"
            aria-label="TikTok"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 11-5.2-1.74 2.89 2.89 0 012.31-1.38V9.07a6.34 6.34 0 00-1 .08 6.34 6.34 0 106.34 6.34V9.32a8.28 8.28 0 004.77 1.47V7.34a4.85 4.85 0 01-1-.65z" />
            </svg>
          </a>
        </div>

        {/* Decorative 4-Point Star Motif on Right Side (matching screenshot) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <svg className="w-10 h-10 text-[#C5A059]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="mt-6 pt-3 border-t border-[#EAD8B1] flex items-center justify-between text-[10px] text-[#8C7A6B]">
        <span>© 2024 SWISS PHONE. Tous rights réservés. L'Art du Hopite.</span>
        {onOpenAdmin && (
          <button onClick={onOpenAdmin} className="text-[#8C7A6B] hover:text-[#C5A059] transition-colors p-1" title="لوحة التحكم">
            <Lock className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <InstagramModal 
        isOpen={isInstagramModalOpen}
        onClose={() => setIsInstagramModalOpen(false)}
        account1={settings.socialLinks.instagram}
        account2={settings.socialLinks.instagram2}
      />
    </footer>
  );
};

