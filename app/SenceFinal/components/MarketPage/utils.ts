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

// Mock data kaldırıldı - artık backend'den geliyor

