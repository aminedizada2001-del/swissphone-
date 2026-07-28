import React from 'react';
import { LayoutGrid, Smartphone, Headphones, Wrench, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { Product } from '../types';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  products: Product[];
  services?: any[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  products,
  services,
}) => {
  // Compute dynamic product/service count per category via JS
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return products.length;
    if (catId === 'services') return services ? services.length : 0;

    return products.filter((p) => {
      if (p.category === catId) return true;
      const cat = (p.category || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const series = (p.series || '').toLowerCase();

      if (catId === 'iphone15') return cat.includes('15') || title.includes('15') || series.includes('15');
      if (catId === 'iphone14') return cat.includes('14') || title.includes('14') || series.includes('14');
      if (catId === 'iphone13') return cat.includes('13') || title.includes('13') || series.includes('13');
      if (catId === 'samsung') return cat.includes('samsung') || title.includes('samsung') || series.includes('samsung') || title.includes('galaxy');
      if (catId === 'xiaomi') return cat.includes('xiaomi') || title.includes('xiaomi') || series.includes('xiaomi') || title.includes('redmi') || title.includes('poco');
      if (catId === 'accessories') return cat.includes('access') || title.includes('airpods') || title.includes('étui') || title.includes('coque') || title.includes('سماعات') || title.includes('إكسسوار');

      return false;
    }).length;
  };

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    setTimeout(() => {
      if (catId === 'services') {
        const el = document.getElementById('services-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById('products-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const renderIcon = (iconName: string, isActive: boolean) => {
    const iconClass = `w-5 h-5 mb-1.5 transition-transform duration-200 ${
      isActive ? 'text-[#C5A059] scale-110' : 'text-[#8C7243]'
    }`;
    switch (iconName) {
      case 'grid':
        return <LayoutGrid className={iconClass} />;
      case 'smartphone':
        return <Smartphone className={iconClass} />;
      case 'headphones':
        return <Headphones className={iconClass} />;
      case 'wrench':
        return <Wrench className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  return (
    <section className="w-full bg-[#FAF8F5] pt-8 pb-0 px-4 sm:px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Title in Arabic */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1F1A17] tracking-tight mb-2">
            الأقسام الرئيسية
          </h2>
          {/* Diamond motif divider */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-[1px] bg-[#C5A059]" />
            <div className="w-2.5 h-2.5 rotate-45 bg-[#C5A059]" />
            <div className="w-12 h-[1px] bg-[#C5A059]" />
          </div>
        </div>

        {/* Categories Single Line Scrollable */}
        <div className="flex overflow-x-auto gap-2.5 sm:gap-3 w-full max-w-5xl mx-auto pb-4 px-2 scrollbar-hide snap-x">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex-shrink-0 w-24 sm:w-28 aspect-square flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-200 shadow-xs active:scale-95 snap-center relative ${
                  isActive
                    ? 'bg-[#1C1713] text-[#F3E3C3] border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/30'
                    : 'bg-[#FFFDF9] text-[#2A231C] border-[#EAD8B1] hover:bg-[#F7F2E8]'
                }`}
              >
                {renderIcon(cat.iconName, isActive)}
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

