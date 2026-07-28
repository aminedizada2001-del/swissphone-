import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Copy, Check } from 'lucide-react';

export const StoreInfoSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      storeInfo: {
        address: 'الجزائر العاصمة، الجزائر (توصيل متوفر لـ 58 ولاية)',
        phone: '0550 58 01 05',
        email: 'contact@swissphone-dz.com'
      },
      socialLinks: {
        whatsapp: '213550560105',
        googleMaps: 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86'
      }
    };
  });

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 is Sunday, 5 is Friday
      // Store open 9 AM to 8 PM, closed Friday
      if (day === 5) {
        setIsOpenNow(false);
      } else {
        setIsOpenNow(hour >= 9 && hour < 20);
      }
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    import('../lib/storeService').then(({ subscribeSettings }) => {
      unsubscribe = subscribeSettings((remoteSettings) => {
      if (remoteSettings && remoteSettings.storeInfo) {
        setSettings({
          storeInfo: {
            ...remoteSettings.storeInfo,
            phone: (!remoteSettings.storeInfo.phone || remoteSettings.storeInfo.phone.includes('779')) ? '0550 58 01 05' : remoteSettings.storeInfo.phone
          },
          socialLinks: {
            whatsapp: (!remoteSettings.socialLinks?.whatsapp || remoteSettings.socialLinks.whatsapp === '213550580105') ? '213550560105' : remoteSettings.socialLinks.whatsapp,
            googleMaps: remoteSettings.socialLinks?.googleMaps || 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86'
          }
        });
        localStorage.setItem('siteSettings', JSON.stringify(remoteSettings));
      }
    });
    });
    return () => unsubscribe();
  }, []);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(settings.storeInfo.phone.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mapsUrl = (settings.socialLinks.googleMaps && settings.socialLinks.googleMaps !== '#') 
    ? settings.socialLinks.googleMaps 
    : 'https://maps.app.goo.gl/YEqNZZ3UNNDW8za86';

  const contactInfo = [
    { 
      icon: MapPin, 
      text: settings.storeInfo.address,
      link: mapsUrl
    },
    { 
      icon: Phone, 
      text: settings.storeInfo.phone,
      link: `tel:${settings.storeInfo.phone.replace(/\s+/g, '')}`,
      isPhone: true
    },
    { 
      icon: Mail, 
      text: settings.storeInfo.email,
      link: `mailto:${settings.storeInfo.email}`
    },
    { icon: Clock, text: "أوقات العمل: من السبت للخميس 09:00 - 20:00" },
  ];

  return (
    <section className="w-full bg-[#FAF8F5] text-[#1F1A17] py-10 px-4 sm:px-6" dir="rtl">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif border-r-4 border-[#C5A059] pr-4">
            معلومات التواصل
          </h2>
          {/* Dynamic JS Status Badge */}
          <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#EAD8B1] px-3 py-1 rounded-full text-xs font-bold shadow-xs">
            <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className={isOpenNow ? 'text-emerald-700' : 'text-amber-700'}>
              {isOpenNow ? 'مفتوح الآن' : 'مغلق الآن'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {contactInfo.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between text-[#1F1A17] group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-[#C5A059] transition-colors underline decoration-[#C5A059]/40 underline-offset-4">
                    {item.text}
                  </a>
                ) : (
                  <p className="text-sm font-medium">{item.text}</p>
                )}
              </div>

              {item.isPhone && (
                <button
                  onClick={handleCopyPhone}
                  className="bg-[#F7F2E8] border border-[#EAD8B1] hover:bg-[#1C1713] hover:text-[#F3E3C3] text-[#8A6A29] p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  title="نسخ رقم الهاتف"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] text-emerald-600">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">نسخ</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ))}

          {/* Google Maps Action Button */}
          <div
            className="pt-2"
          >
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#1C1713] text-[#F3E3C3] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-[#C5A059]/40 hover:bg-[#2A231C] transition-all shadow-md active:scale-95"
            >
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>عرض الموقع على خرائط Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

