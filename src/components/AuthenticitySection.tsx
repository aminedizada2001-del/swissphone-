import React from 'react';
import { Award, ShieldCheck, Briefcase } from 'lucide-react';
import goldIphone3D from '../assets/images/gold_iphone_3d_real_1785068896861.jpg';
import seal3D from '../assets/images/swiss_seal_3d_real_1785068909694.jpg';
import leatherCases3D from '../assets/images/leather_cases_3d_real_1785068922902.jpg';

export const AuthenticitySection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF8F5] pt-1 pb-1 sm:pt-2 sm:pb-2 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-2 sm:mb-3">
          <h2 className="text-sm sm:text-lg font-serif font-bold text-[#2A231C] tracking-wide mb-1.5">
            L'Engagement pour l'Authenticité
          </h2>
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />
        </div>

        {/* 3 Luxury 3D Cards with Enriched Prominent Images */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {/* Card 1: iPhones Certifiés */}
          <div className="bg-[#FFFDF9] rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-[#E8D9B8] shadow-[0_8px_24px_rgba(197,160,89,0.15)] hover:shadow-[0_12px_32px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between items-center text-center">
            <div className="flex flex-col items-center w-full mb-1 sm:mb-1.5">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059] mb-0.5" />
              <h3 className="text-[10px] sm:text-[13px] font-serif font-bold text-[#1F1A17] leading-tight">
                iPhones Certifiés d'Exception
              </h3>
            </div>
            <div className="w-full aspect-[5/4] sm:aspect-[3/2] rounded-lg overflow-hidden bg-[#F3ECE0] flex items-center justify-center border border-[#E2CE9F] shadow-inner">
              <img
                src={goldIphone3D}
                alt="iPhones Certifiés 3D"
                className="w-full h-full object-cover rounded-md transition-transform duration-500 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 2: Produits 100% Originaux */}
          <div className="bg-[#FFFDF9] rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-[#E8D9B8] shadow-[0_8px_24px_rgba(197,160,89,0.15)] hover:shadow-[0_12px_32px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between items-center text-center">
            <div className="flex flex-col items-center w-full mb-1 sm:mb-1.5">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059] mb-0.5" />
              <h3 className="text-[10px] sm:text-[13px] font-serif font-bold text-[#1F1A17] leading-tight">
                Produits 100% Originaux
              </h3>
            </div>
            <div className="w-full aspect-[5/4] sm:aspect-[3/2] rounded-lg overflow-hidden bg-[#FFFDF9] flex items-center justify-center p-1 sm:p-1.5 border border-[#E2CE9F] shadow-inner">
              <img
                src={seal3D}
                alt="Sceau de Garantie Authentique 3D"
                className="w-full h-full object-contain drop-shadow-lg transition-transform duration-500 hover:scale-115"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Card 3: Artisanat d'Accessoires Premium */}
          <div className="bg-[#FFFDF9] rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 border-2 border-[#E8D9B8] shadow-[0_8px_24px_rgba(197,160,89,0.15)] hover:shadow-[0_12px_32px_rgba(197,160,89,0.25)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between items-center text-center">
            <div className="flex flex-col items-center w-full mb-1 sm:mb-1.5">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#C5A059] mb-0.5" />
              <h3 className="text-[10px] sm:text-[13px] font-serif font-bold text-[#1F1A17] leading-tight">
                Artisanat d'Accessoires Premium
              </h3>
            </div>
            <div className="w-full aspect-[5/4] sm:aspect-[3/2] rounded-lg overflow-hidden bg-[#F3ECE0] flex items-center justify-center border border-[#E2CE9F] shadow-inner">
              <img
                src={leatherCases3D}
                alt="Accessoires Premium 3D"
                className="w-full h-full object-cover rounded-md transition-transform duration-500 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};




