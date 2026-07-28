import React from 'react';
import { Instagram, X, ExternalLink } from 'lucide-react';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  account1?: string;
  account2?: string;
}

export const InstagramModal: React.FC<InstagramModalProps> = ({
  isOpen,
  onClose,
  account1 = 'https://www.instagram.com/swissphone09?igsh=Njh4bWNmeG95bTE4',
  account2 = 'https://www.instagram.com/swiss_phone09?igsh=dDgzczk3aDdyOTBq',
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#141416] border border-[#C5A059]/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center text-white space-y-5 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#833AB4] flex items-center justify-center mx-auto shadow-lg shadow-[#DD2A7B]/20">
          <Instagram className="w-8 h-8 text-white" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#F3E3C3]">حسابات إنستغرام</h3>
          <p className="text-xs text-gray-300 mt-1">اختر حساب Instagram الذي تود متابعته</p>
        </div>

        <div className="space-y-3 pt-1">
          <a
            href={account1}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-4 bg-[#1E1E22] hover:bg-[#282830] border border-[#C5A059]/30 hover:border-[#C5A059] rounded-2xl transition-all group shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#833AB4] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-white group-hover:text-[#F3E3C3] transition-colors">الحساب الأول (الرئيسي)</div>
                <div className="text-xs text-gray-400 dir-ltr font-mono mt-0.5">@swissphone09</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F3E3C3] transition-colors" />
          </a>

          <a
            href={account2}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between p-4 bg-[#1E1E22] hover:bg-[#282830] border border-[#C5A059]/30 hover:border-[#C5A059] rounded-2xl transition-all group shadow-sm active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#833AB4] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-white group-hover:text-[#F3E3C3] transition-colors">الحساب الثاني</div>
                <div className="text-xs text-gray-400 dir-ltr font-mono mt-0.5">@swiss_phone09</div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F3E3C3] transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
};
