import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { marketService } from '@/services/market.service';

import { filterProductsByCategory, getCategoryName } from './utils';
import { Category, Product, ProductCategory, ShippingAddress } from './types';

const DEFAULT_CATEGORIES: Category[] = [{ id: 'all', name: 'Tümü', iconName: 'grid-outline' }];

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&q=80';

export function useMarket() {
  const { refreshProfile, user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMarketData = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setCategories(DEFAULT_CATEGORIES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const [itemsResult, categoriesResult] = await Promise.all([
        marketService.getMarketItems(),
        marketService.getMarketCategories(),
      ]);

      if (itemsResult.error) {
        throw itemsResult.error;
      }

      if (categoriesResult.error) {
        throw categoriesResult.error;
      }

      const mappedProducts: Product[] = (itemsResult.data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price || 0,
        originalPrice: item.original_price || undefined,
        image: item.image_url || FALLBACK_PRODUCT_IMAGE,
        category: item.type || 'other',
        requiresShipping: Boolean(item.requires_shipping),
        featured: Boolean(item.featured),
        badge: item.badge || undefined,
      }));

      const mappedCategories: Category[] = (categoriesResult.data || [])
        .filter(cat => cat.slug !== 'all')
        .map(cat => ({
          id: cat.slug,
          name: cat.name,
          iconName: cat.icon_name || 'pricetag-outline',
        }));

      setProducts(mappedProducts);
      setCategories([...DEFAULT_CATEGORIES, ...mappedCategories]);
    } catch (err) {
      console.error('Market data load error:', err);
      setProducts([]);
      setCategories(DEFAULT_CATEGORIES);
      setErrorMessage('Market verileri yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    if (!categories.some(category => category.id === selectedCategory)) {
      setSelectedCategory('all');
    }
  }, [categories, selectedCategory]);

  const filteredProducts = useMemo(
    () => filterProductsByCategory(products, selectedCategory),
    [products, selectedCategory],
  );

  const categoryName = useMemo(
    () => getCategoryName(categories, selectedCategory),
    [categories, selectedCategory],
  );

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
    setSelectedProduct(null);
  };

  const handleConfirmPurchase = async (userCredits: number, shippingAddress?: ShippingAddress) => {
    if (!selectedProduct || !user) {
      Alert.alert('Hata', 'Satın alma için giriş yapmalısınız.');
      return;
    }

    if (userCredits < selectedProduct.price) {
      Alert.alert('Hata', 'Bu ürünü satın almak için yeterli krediniz yok.');
      return;
    }

    if (selectedProduct.requiresShipping && !shippingAddress) {
      Alert.alert('Hata', 'Fiziksel ürünler için adres bilgisi zorunludur.');
      return;
    }

    try {
      setPurchaseLoading(true);

      const result = await marketService.purchaseItem({
        item_id: selectedProduct.id,
        quantity: 1,
        shipping_address: shippingAddress,
      });

      if (result.error) {
        throw result.error;
      }

      Alert.alert('Başarılı', `${selectedProduct.name} satın alındı.`);
      handleCloseModal();
      await Promise.all([loadMarketData(), refreshProfile()]);
    } catch (err) {
      console.error('Purchase error:', err);
      const message = err instanceof Error && err.message ? err.message : 'Ürün satın alınırken bir hata oluştu.';
      Alert.alert('Hata', message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  return {
    selectedCategory,
    showPurchaseModal,
    selectedProduct,
    loading,
    purchaseLoading,
    errorMessage,

    products,
    categories,
    filteredProducts,
    categoryName,

    setSelectedCategory,
    handleProductPress,
    handleCloseModal,
    handleConfirmPurchase,
    retryLoadMarketData: loadMarketData,
  };
}
