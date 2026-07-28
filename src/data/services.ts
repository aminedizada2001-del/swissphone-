import { RepairService } from '../types';

export const INITIAL_SERVICES: RepairService[] = [
  {
    id: 'screen',
    title: 'إصلاح واستبدال الشاشات',
    iconName: 'Smartphone',
    time: '30 - 60 دقيقة',
    price: 'يبدأ من 4,500',
  },
  {
    id: 'battery',
    title: 'تغيير البطاريات الأصلية',
    iconName: 'Battery',
    time: '30 دقيقة',
    price: 'يبدأ من 3,500',
  },
  {
    id: 'camera',
    title: 'إصلاح وصيانة الكاميرا',
    iconName: 'Camera',
    time: '45 - 60 دقيقة',
    price: 'يبدأ من 5,000',
  }
];
