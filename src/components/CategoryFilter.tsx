import React from 'react';
import { LayoutGrid, Smartphone } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="w-full bg-[#FAF8F5] pt-8 pb-0 px-4 sm:px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Title in Arabic */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1A17] tracking-tight mb-2">
            الأقسام الرئيسية
          </h2>
          {/* Diamond motif divider matching screenshot */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-[1px] bg-[#C5A059]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#C5A059]" />
            <div className="w-12 h-[1px] bg-[#C5A059]" />
          </div>
        </div>

        {/* Categories Single Line Scrollable */}
        <div className="flex overflow-x-auto gap-2.5 sm:gap-3 w-full max-w-5xl mx-auto pb-4 px-2 scrollbar-hide snap-x">
          {CATEGORIES.slice(0, 6).map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex-shrink-0 w-24 sm:w-28 aspect-square flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 shadow-xs active:scale-95 snap-center ${
                  isActive
                    ? 'bg-[#1C1713] text-[#F3E3C3] border-[#C5A059] shadow-md'
                    : 'bg-[#FFFDF9] text-[#2A231C] border-[#EAD8B1] hover:bg-[#F7F2E8]'
                }`}
              >
                {cat.iconName === 'grid' ? (
                  <LayoutGrid
                    className={`w-5 h-5 mb-1.5 ${
                      isActive ? 'text-[#C5A059]' : 'text-[#8C7243]'
                    }`}
                  />
                ) : (
                  <Smartphone
                    className={`w-5 h-5 mb-1.5 ${
                      isActive ? 'text-[#C5A059]' : 'text-[#8C7243]'
                    }`}
                  />
                )}
                <span className="text-xs font-bold tracking-tight text-center leading-tight">
                  {cat.nameArabic}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
