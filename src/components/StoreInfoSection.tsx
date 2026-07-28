import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { subscribeSettings } from '../lib/storeService';

export const StoreInfoSection: React.FC = () => {
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
    const unsubscribe = subscribeSettings((remoteSettings) => {
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
    return () => unsubscribe();
  }, []);

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
      link: `tel:${settings.storeInfo.phone.replace(/\s+/g, '')}`
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
        <h2 className="text-2xl font-bold font-serif mb-6 border-r-4 border-[#C5A059] pr-4">
          معلومات التواصل
        </h2>

        <div className="space-y-4">
          {contactInfo.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 text-[#1F1A17]"
            >
              <item.icon className="w-5 h-5 text-[#C5A059] flex-shrink-0" />
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-[#C5A059] transition-colors underline decoration-[#C5A059]/40 underline-offset-4">
                  {item.text}
                </a>
              ) : (
                <p className="text-sm font-medium">{item.text}</p>
              )}
            </motion.div>
          ))}

          {/* Google Maps Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};
