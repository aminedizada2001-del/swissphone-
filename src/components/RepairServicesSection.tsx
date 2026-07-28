import React from 'react';
import { Smartphone, Battery, Camera, Clock, Tag, Wrench, ChevronLeft, Cpu, Wifi, Volume2, Mic, Droplet, Zap, ShieldCheck, MonitorSmartphone } from 'lucide-react';
import { RepairService } from '../types';

interface RepairServicesSectionProps {
  services: RepairService[];
}

const renderIcon = (name: string) => {
  const props = { className: "w-6 h-6 text-[#E6C280]" };
  switch (name) {
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Battery': return <Battery {...props} />;
    case 'Camera': return <Camera {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'Wifi': return <Wifi {...props} />;
    case 'Volume2': return <Volume2 {...props} />;
    case 'Mic': return <Mic {...props} />;
    case 'Droplet': return <Droplet {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'MonitorSmartphone': return <MonitorSmartphone {...props} />;
    default: return <Wrench {...props} />;
  }
};

export const RepairServicesSection: React.FC<RepairServicesSectionProps> = ({ services }) => {
  const handleBookRepair = (serviceTitle: string) => {
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

    const message = encodeURIComponent(`مرحباً Swiss Phone، أود حجز موعد لخدمة الصيانة: ${serviceTitle}`);
    window.open(`https://wa.me/${waNum}?text=${message}`, '_blank');
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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section id="services-section" className="w-full bg-[#FAF8F5] py-10 px-4 sm:px-6 scroll-mt-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1A17] tracking-tight mb-2 font-serif">
            مركز صيانة الهواتف المعتمد
          </h2>
          <p className="text-[#8A6A29] font-bold text-sm tracking-widest uppercase mb-3 font-sans">
            SWISS PHONE REPAIR SERVICES
          </p>
          {/* Diamond motif divider */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-[1px] bg-[#C5A059]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#C5A059]" />
            <div className="w-12 h-[1px] bg-[#C5A059]" />
          </div>
        </div>

        {/* Services Card */}
        <div className="bg-[#FFFDF9] border border-[#EAD8B1] rounded-[32px] p-4 sm:p-6 shadow-sm w-full max-w-md mx-auto relative overflow-hidden">
          <div
            className="flex flex-col gap-6 relative z-10"
          >
            {services.map((service, index) => (
              <div key={service.id} className="flex flex-col gap-4">
                {/* Header: Title and Icon */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1C1713] rounded-2xl flex items-center justify-center shadow-md border border-[#C5A059]/20 flex-shrink-0">
                    {renderIcon(service.iconName)}
                  </div>
                  <h3 className="text-lg font-bold text-[#1F1A17]">{service.title}</h3>
                </div>

                {/* Badges: Time and Price */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-1.5 bg-[#F7F2E8] border border-[#EAD8B1]/60 rounded-lg px-3 py-1.5 flex-1">
                    <Clock className="w-3.5 h-3.5 text-[#8A6A29]" />
                    <span className="text-xs font-medium text-[#4A3F35]">الوقت المتوقع: {service.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F7F2E8] border border-[#EAD8B1]/60 rounded-lg px-3 py-1.5 flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8A6A29]" />
                    <span className="text-xs font-medium text-[#4A3F35]">السعر: DA {service.price}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleBookRepair(service.title)}
                  className="w-full bg-[#1C1713] text-[#F3E3C3] hover:bg-[#2A231C] active:scale-95 transition-all py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md border border-[#C5A059]/30"
                >
                  <Wrench className="w-5 h-5 text-[#E6C280]" />
                  احجز إصلاحاً فورياً
                </button>

                {/* Divider between items (except last) */}
                {index !== services.length - 1 && (
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EAD8B1] to-transparent mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
