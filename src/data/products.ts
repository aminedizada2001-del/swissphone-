import { Product, Category } from '../types';

import iphone13Img from '../assets/images/iphone13_3d_render_1785026088830.jpg';
import iphone13ProImg from '../assets/images/iphone13_pro_3d_1785026104109.jpg';
import samsungImg from '../assets/images/samsung_s24_3d_1785026117305.jpg';
import xiaomiImg from '../assets/images/xiaomi_14_3d_1785026130115.jpg';
import goldIphoneImg from '../assets/images/luxury_gold_iphone_1785025196051.jpg';
import airpodsImg from '../assets/images/luxury_airpods_pen_1785025206817.jpg';
import leatherCasesImg from '../assets/images/luxury_leather_cases_1785025218880.jpg';
import sealImg from '../assets/images/swiss_phone_seal_1785025185853.jpg';

export { sealImg, goldIphoneImg, airpodsImg, leatherCasesImg };

export const CATEGORIES: Category[] = [
  { id: 'all', nameArabic: 'الكل', iconName: 'grid' },
  { id: 'iphone15', nameArabic: 'سلسلة iPhone 15', iconName: 'smartphone' },
  { id: 'iphone14', nameArabic: 'سلسلة iPhone 14', iconName: 'smartphone' },
  { id: 'iphone13', nameArabic: 'سلسلة iPhone 13', iconName: 'smartphone' },
  { id: 'samsung', nameArabic: 'سلسلة Samsung', iconName: 'smartphone' },
  { id: 'xiaomi', nameArabic: 'سلسلة Xiaomi', iconName: 'smartphone' },
  { id: 'accessories', nameArabic: 'إكسسوارات', iconName: 'headphones' },
  { id: 'services', nameArabic: 'خدمات الصيانة', iconName: 'wrench' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'ip13',
    title: 'iPhone 13',
    series: 'سلسلة iPhone 13',
    category: 'iphone13',
    priceDA: 108000,
    image: iphone13Img,
    description: 'iPhone 13 128GB - État Neuf Certifié, Écran Super Retina XDR, Puce A15 Bionic.',
    inStock: true,
  },
  {
    id: 'ip13pm',
    title: 'iPhone 13 Pro Max',
    series: 'سلسلة iPhone 13',
    category: 'iphone13',
    priceDA: 155000,
    image: iphone13ProImg,
    description: 'iPhone 13 Pro Max 256GB - Finition Titane, Triple Caméra Pro, Autonomie Exceptionnelle.',
    inStock: true,
  },
  {
    id: 'xiaomi14u',
    title: 'Xiaomi 14 Ultra',
    series: 'سلسلة Xiaomi',
    category: 'xiaomi',
    priceDA: 180000,
    image: xiaomiImg,
    description: 'Xiaomi 14 Ultra 512GB - Optique Leica Quad-Camera 50MP, Snapdragon 8 Gen 3.',
    inStock: true,
  },
  {
    id: 'sams24u',
    title: 'Samsung S24 Ultra',
    series: 'سلسلة Samsung',
    category: 'samsung',
    priceDA: 220000,
    image: samsungImg,
    description: 'Samsung Galaxy S24 Ultra 512GB - Châssis Titane, S-Pen Intégré, Galaxy AI.',
    inStock: true,
  },
  {
    id: 'ip14pm',
    title: 'iPhone 14 Pro Max',
    series: 'سلسلة iPhone 14',
    category: 'iphone14',
    priceDA: 195000,
    image: goldIphoneImg,
    description: 'iPhone 14 Pro Max 256GB - Dynamic Island, Appareil Photo 48MP, Écran Toujours Activé.',
    inStock: true,
  },
  {
    id: 'ip15pm',
    title: 'iPhone 15 Pro Max',
    series: 'سلسلة iPhone 15',
    category: 'iphone15',
    priceDA: 245000,
    image: goldIphoneImg,
    description: 'iPhone 15 Pro Max 256GB Édition Titane Or - Zoom Optique 5x, Bouton Action, Puce A17 Pro.',
    inStock: true,
  },
  {
    id: 'airpods_pro2',
    title: 'AirPods Pro 2ème Génération',
    series: 'Accessoires Premium',
    category: 'accessories',
    priceDA: 45000,
    image: airpodsImg,
    description: 'AirPods Pro 2 MagSafe USB-C - Réduction Bruit Active Améliorée, Audio Spatial Personalisé.',
    inStock: true,
  },
  {
    id: 'coque_cuir',
    title: 'Étui Cuir MagSafe Artisanat',
    series: 'Accessoires Premium',
    category: 'accessories',
    priceDA: 12000,
    image: leatherCasesImg,
    description: 'Étui en Cuir Véritable Fait Main - Protection Élégante avec Maintien MagSafe Renforcé.',
    inStock: true,
  },
];
