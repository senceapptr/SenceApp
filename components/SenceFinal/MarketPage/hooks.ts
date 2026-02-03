import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { marketService } from '@/services/market.service';
import { Product, ProductCategory } from './types';
import { 
  filterProductsByCategory,
  getCategoryName 
} from './utils';

// Fallback mock data
const mockProducts: Product[] = [];
const mockCategories = [{ id: 'all' as ProductCategory, name: 'Tümü', icon: '🛍️' }];

export function useMarket() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(true);

  // Backend'den market verilerini yükle
  const loadMarketData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Paralel olarak ürünler ve kategorileri yükle
      const [itemsResult, categoriesResult] = await Promise.all([
        marketService.getMarketItems(),
        marketService.getMarketCategories(),
      ]);

      // Ürünler
      if (itemsResult.data) {
        const mappedProducts: Product[] = itemsResult.data.map((item: any) => ({
          id: parseInt(item.id) || 0,
          name: item.name,
          description: item.description || '',
          price: item.price || 0,
          originalPrice: undefined,
          image: item.image_url || item.icon || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
          category: item.type || 'boost',
          featured: false,
          badge: undefined,
        }));
        setProducts(mappedProducts);
      }

      // Kategoriler
      if (categoriesResult.data) {
        const mappedCategories = categoriesResult.data.map((cat: any) => ({
          id: cat.slug as ProductCategory,
          name: cat.name,
          icon: cat.icon || '🛍️',
        }));
        setCategories([{ id: 'all', name: 'Tümü', icon: '🛍️' }, ...mappedCategories]);
      }

    } catch (err) {
      console.error('Market data load error:', err);
      Alert.alert('Hata', 'Market verileri yüklenirken bir hata oluştu');
      // Fallback to mock data
      setProducts(mockProducts);
      setCategories(mockCategories);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadMarketData();
  }, [user]);

  // Computed values
  const filteredProducts = useMemo(
    () => filterProductsByCategory(products, selectedCategory),
    [products, selectedCategory]
  );

  const categoryName = useMemo(
    () => getCategoryName(categories, selectedCategory),
    [categories, selectedCategory]
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

  const handleConfirmPurchase = async (userCredits: number) => {
    if (!selectedProduct || !user || userCredits < selectedProduct.price) {
      Alert.alert('Hata', 'Bu ürünü satın almak için yeterli krediniz yok');
      return;
    }

    try {
      const result = await marketService.purchaseItem({
        item_id: selectedProduct.id.toString(),
        user_id: user.id,
        quantity: 1,
      });

      if (result.data) {
        Alert.alert('Başarılı!', `${selectedProduct.name} başarıyla satın alındı! 🎉`);
        handleCloseModal();
        // Verileri yenile
        loadMarketData();
      }
    } catch (err) {
      console.error('Purchase error:', err);
      Alert.alert('Hata', 'Ürün satın alınırken bir hata oluştu');
    }
  };

  return {
    // State
    selectedCategory,
    showPurchaseModal,
    selectedProduct,
    loading,
    
    // Data
    products,
    categories,
    filteredProducts,
    categoryName,
    
    // Handlers
    setSelectedCategory,
    handleProductPress,
    handleCloseModal,
    handleConfirmPurchase,
  };
}

