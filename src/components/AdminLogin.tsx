import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = localStorage.getItem('siteSettings');
    let correctPassword = 'swiss0000';
    
    if (saved) {
      const { adminPassword } = JSON.parse(saved);
      if (adminPassword) correctPassword = adminPassword;
    }

    if (password === correctPassword) {
      onLogin();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-[#FAF8F5] rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-[#1C1713] rounded-full flex items-center justify-center shadow-md border border-[#C5A059]/20 mb-4">
            <Lock className="w-8 h-8 text-[#E6C280]" />
          </div>
          <h2 className="text-xl font-bold font-serif text-[#1F1A17]">لوحة التحكم</h2>
          <p className="text-sm text-[#8A6A29] mt-1">أدخل كلمة المرور للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full bg-[#FFFDF9] border border-[#EAD8B1] rounded-xl px-4 py-3 text-[#1F1A17] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-center"
              dir="ltr"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1C1713] text-[#F3E3C3] py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md hover:bg-[#2A231C] transition-colors"
            >
              <LogIn className="w-5 h-5 text-[#E6C280]" />
              دخول
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-[#EAD8B1]/20 text-[#4A3F35] py-3 rounded-xl font-bold hover:bg-[#EAD8B1]/40 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
