export interface MarketPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  userCredits: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  featured: boolean;
  badge?: string;
}

export type ProductCategory = 'all' | 'elektronik' | 'ev' | 'hizmet' | 'hediye';

export interface Category {
  id: ProductCategory;
  name: string;
  icon: string;
}

// Component Props
export interface PageHeaderProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export interface CategoriesBarProps {
  categories: Category[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export interface CategoryButtonProps {
  category: Category;
  isActive: boolean;
  onPress: () => void;
}

export interface ProductsListProps {
  products: Product[];
  userCredits: number;
  selectedCategory: ProductCategory;
  categoryName: string;
  onProductPress: (product: Product) => void;
}

export interface ProductCardProps {
  product: Product;
  userCredits: number;
  onPress: () => void;
}

export interface ProductImageProps {
  uri: string;
  badge?: string;
}

export interface ProductBadgeProps {
  text: string;
  position?: 'absolute' | 'relative';
}

export interface ProductInfoProps {
  name: string;
  description: string;
}

export interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
}

export interface AvailabilityBadgeProps {
  available: boolean;
  variant?: 'small' | 'large';
}

export interface PurchaseModalProps {
  visible: boolean;
  product: Product | null;
  userCredits: number;
  onClose: () => void;
  onConfirm: () => void;
}

export interface EmptyStateProps {
  message: string;
}

