import exactHeroMatchImg from '../assets/images/swiss_phone_hero_exact_match_1785069510478.jpg';
import goldIphone3D from '../assets/images/gold_iphone_3d_real_1785068896861.jpg';
import seal3D from '../assets/images/swiss_seal_3d_real_1785068909694.jpg';
import leatherCases3D from '../assets/images/leather_cases_3d_real_1785068922902.jpg';

import iphone13Img from '../assets/images/iphone13_3d_render_1785026088830.jpg';
import iphone13ProImg from '../assets/images/iphone13_pro_3d_1785026104109.jpg';
import samsungImg from '../assets/images/samsung_s24_3d_1785026117305.jpg';
import xiaomiImg from '../assets/images/xiaomi_14_3d_1785026130115.jpg';
import goldIphoneImg from '../assets/images/luxury_gold_iphone_1785025196051.jpg';
import airpodsImg from '../assets/images/luxury_airpods_pen_1785025206817.jpg';
import leatherCasesImg from '../assets/images/luxury_leather_cases_1785025218880.jpg';
import sealImg from '../assets/images/swiss_phone_seal_1785025185853.jpg';

const landingPageImages = [
  exactHeroMatchImg,
  goldIphone3D,
  seal3D,
  leatherCases3D,
  iphone13Img,
  iphone13ProImg,
  samsungImg,
  xiaomiImg,
  goldIphoneImg,
  airpodsImg,
  leatherCasesImg,
  sealImg,
];

export function preloadLandingImages() {
  if (typeof window === 'undefined') return;

  // Instantly warm up image cache for zero-delay rendering
  landingPageImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // Also check local storage for custom hero or authenticity images
  try {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.landingImages) {
        Object.values(parsed.landingImages).forEach((url) => {
          if (typeof url === 'string' && url) {
            const img = new Image();
            img.src = url;
          }
        });
      }
    }
  } catch (e) {
    // Ignore cache warmup error
  }
}

// Execute preloader immediately on module import
preloadLandingImages();
