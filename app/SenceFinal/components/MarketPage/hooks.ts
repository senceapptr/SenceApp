import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { Product, ProductCategory } from './types';
import { 
  mockProducts, 
  mockCategories, 
  filterProductsByCategory,
  getCategoryName 
} from './utils';

export function useMarket() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Computed values
  const filteredProducts = useMemo(
    () => filterProductsByCategory(mockProducts, selectedCategory),
    [selectedCategory]
  );

  const categoryName = useMemo(
    () => getCategoryName(mockCategories, selectedCategory),
    [selectedCategory]
  );

  // Handlers
  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
    setSelectedProduct(null);
  };

  const handleConfirmPurchase = (userCredits: number) => {
    if (selectedProduct && userCredits >= selectedProduct.price) {
      Alert.alert('Başarılı!', `${selectedProduct.name} başarıyla satın alındı! 🎉`);
      handleCloseModal();
    }
  };

  return {
    // State
    selectedCategory,
    showPurchaseModal,
    selectedProduct,
    
    // Data
    products: mockProducts,
    categories: mockCategories,
    filteredProducts,
    categoryName,
    
    // Handlers
    setSelectedCategory,
    handleProductPress,
    handleCloseModal,
    handleConfirmPurchase,
  };
}

