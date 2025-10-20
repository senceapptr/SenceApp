import { Product, ProductCategory, Category } from './types';

/**
 * Formats a number as Turkish locale currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('tr-TR').format(price);
};

/**
 * Filters products by category
 */
export const filterProductsByCategory = (
  products: Product[],
  category: ProductCategory
): Product[] => {
  if (category === 'all') {
    return products;
  }
  return products.filter(p => p.category === category);
};

/**
 * Gets featured products
 */
export const getFeaturedProducts = (products: Product[]): Product[] => {
  return products.filter(p => p.featured);
};

/**
 * Checks if user can afford a product
 */
export const isProductAvailable = (userCredits: number, productPrice: number): boolean => {
  return userCredits >= productPrice;
};

/**
 * Gets category name by id
 */
export const getCategoryName = (categories: Category[], categoryId: ProductCategory): string => {
  const category = categories.find(c => c.id === categoryId);
  return category?.name || 'Tümü';
};

/**
 * Mock products data
 */
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16" M3',
    description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD',
    price: 5000000,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
    category: 'elektronik',
    featured: true,
    badge: 'En Popüler'
  },
  {
    id: 2,
    name: 'Dyson V15 Detect',
    description: 'Laser teknolojisi ile kablosuz süpürge',
    price: 1200000,
    originalPrice: 1500000,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    category: 'ev',
    featured: true,
    badge: 'İndirimli'
  },
  {
    id: 3,
    name: 'MacFit Gold Üyelik',
    description: '1 yıllık premium spor salonu üyeliği',
    price: 800000,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'hizmet',
    featured: false,
  },
  {
    id: 4,
    name: 'iPhone 15 Pro Max',
    description: 'Titanium, 256GB, Doğal Titanyum',
    price: 3500000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
    category: 'elektronik',
    featured: true,
  },
  {
    id: 5,
    name: 'Netflix Hediye Çeki',
    description: '1 yıllık Netflix Premium üyeliği',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
    category: 'hediye',
    featured: false,
  },
  {
    id: 6,
    name: 'AirPods Pro 2',
    description: 'USB-C, Active Noise Cancellation',
    price: 600000,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c5c7c0?w=400&h=300&fit=crop',
    category: 'elektronik',
    featured: false,
  }
];

/**
 * Mock categories data
 */
export const mockCategories: Category[] = [
  { id: 'all', name: 'Tümü', icon: '🛍️' },
  { id: 'elektronik', name: 'Elektronik', icon: '📱' },
  { id: 'ev', name: 'Ev & Yaşam', icon: '🏠' },
  { id: 'hizmet', name: 'Hizmetler', icon: '💼' },
  { id: 'hediye', name: 'Hediye Çekleri', icon: '🎁' }
];

