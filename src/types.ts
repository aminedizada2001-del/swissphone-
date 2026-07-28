export interface Product {
  id: string;
  title: string;
  series: string;
  category: 'iphone13' | 'iphone14' | 'iphone15' | 'samsung' | 'xiaomi' | 'accessories';
  priceDA: number;
  image: string;
  description?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  nameArabic: string;
  iconName: 'grid' | 'smartphone';
}

export interface RepairService {
  id: string;
  title: string;
  iconName: string;
  time: string;
  price: string;
}

