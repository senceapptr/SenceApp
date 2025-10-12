import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MarketPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  userCredits: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  featured: boolean;
  badge?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

export function MarketPage({ onBack, onMenuToggle, userCredits }: MarketPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
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

  const categories: Category[] = [
    { id: 'all', name: 'Tümü', icon: '🛍️' },
    { id: 'elektronik', name: 'Elektronik', icon: '📱' },
    { id: 'ev', name: 'Ev & Yaşam', icon: '🏠' },
    { id: 'hizmet', name: 'Hizmetler', icon: '💼' },
    { id: 'hediye', name: 'Hediye Çekleri', icon: '🎁' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.filter(p => p.featured);

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (selectedProduct && userCredits >= selectedProduct.price) {
      Alert.alert('Başarılı!', `${selectedProduct.name} başarıyla satın alındı! 🎉`);
      setShowPurchaseModal(false);
      setSelectedProduct(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  const renderFeaturedProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.featuredCard}
      onPress={() => handlePurchase(product)}
      activeOpacity={0.8}
    >
      {product.badge && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.featuredImageContainer}>
        <Image 
          source={{ uri: product.image }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.featuredDescription} numberOfLines={1}>{product.description}</Text>
        
        <View style={styles.featuredPricing}>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)} 💎</Text>
          )}
          <Text style={styles.featuredPrice}>{formatPrice(product.price)} 💎</Text>
        </View>
        
        <View style={[
          styles.availabilityBadge,
          userCredits >= product.price ? styles.availableBadge : styles.unavailableBadge
        ]}>
          <Text style={[
            styles.availabilityText,
            userCredits >= product.price ? styles.availableText : styles.unavailableText
          ]}>
            {userCredits >= product.price ? '✓ Alabilir' : '✗ Yetersiz'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handlePurchase(product)}
      activeOpacity={0.8}
    >
      <View style={styles.productContent}>
        <View style={styles.productImageContainer}>
          <Image 
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.badge && (
            <View style={styles.productBadge}>
              <Text style={styles.productBadgeText}>{product.badge}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
          
          <View style={styles.productFooter}>
            <View style={styles.productPricing}>
              {product.originalPrice && (
                <Text style={styles.productOriginalPrice}>{formatPrice(product.originalPrice)} 💎</Text>
              )}
              <Text style={styles.productPrice}>{formatPrice(product.price)} 💎</Text>
            </View>
            
            <View style={[
              styles.productAvailability,
              userCredits >= product.price ? styles.productAvailable : styles.productUnavailable
            ]}>
              <Text style={[
                styles.productAvailabilityText,
                userCredits >= product.price ? styles.productAvailableText : styles.productUnavailableText
              ]}>
                {userCredits >= product.price ? '✓ Satın Al' : '✗ Yetersiz'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      {/* Header */}
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#B29EFD']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Market</Text>
            <Text style={styles.headerSubtitle}>Kredilerinle gerçek ürünler kazan</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <View style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Products */}
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>⭐ Öne Çıkanlar</Text>
          
          <View style={styles.featuredGrid}>
            {featuredProducts.slice(0, 4).map(renderFeaturedProduct)}
          </View>
        </View>

        {/* All Products */}
        <View style={styles.productsSection}>
          <View style={styles.productsSectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'Tüm Ürünler' : categories.find(c => c.id === selectedCategory)?.name}
            </Text>
            <Text style={styles.productsCount}>
              {filteredProducts.length} ürün
            </Text>
          </View>
          
          <View style={styles.productsList}>
            {filteredProducts.map(renderProduct)}
          </View>
        </View>
      </ScrollView>

      {/* Purchase Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalProductImage}>
                    <Image 
                      source={{ uri: selectedProduct.image }}
                      style={styles.modalImage}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalProductDescription}>{selectedProduct.description}</Text>
                </View>

                <View style={styles.modalPricing}>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPriceLabel}>Fiyat</Text>
                    <Text style={styles.modalPrice}>{formatPrice(selectedProduct.price)} 💎</Text>
                  </View>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPriceLabel}>Mevcut Kredi</Text>
                    <Text style={[
                      styles.modalCredits,
                      userCredits >= selectedProduct.price ? styles.sufficientCredits : styles.insufficientCredits
                    ]}>
                      {formatPrice(userCredits)} 💎
                    </Text>
                  </View>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    onPress={() => setShowPurchaseModal(false)}
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>İptal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={confirmPurchase}
                    disabled={userCredits < selectedProduct.price}
                    style={[
                      styles.purchaseButton,
                      userCredits < selectedProduct.price && styles.disabledPurchaseButton
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.purchaseButtonText,
                      userCredits < selectedProduct.price && styles.disabledPurchaseButtonText
                    ]}>
                      Satın Al
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: 'white',
    borderRadius: 1.25,
  },
  categoriesContainer: {
    backgroundColor: '#F2F3F5',
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  activeCategoryButton: {
    backgroundColor: '#432870',
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  activeCategoryText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featuredCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F3F5',
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
  },
  badge: {
    backgroundColor: '#432870',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  featuredImageContainer: {
    aspectRatio: 1,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 12,
    color: '#202020',
    opacity: 0.7,
    marginBottom: 8,
  },
  featuredPricing: {
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#202020',
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
  },
  unavailableBadge: {
    backgroundColor: '#FEE2E2',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  availableText: {
    color: '#065F46',
  },
  unavailableText: {
    color: '#991B1B',
  },
  productsSection: {
    padding: 16,
  },
  productsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  productsCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#432870',
  },
  productsList: {
    gap: 16,
    paddingBottom: 24,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  productContent: {
    flexDirection: 'row',
    padding: 16,
  },
  productImageContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#432870',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productPricing: {},
  productOriginalPrice: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.5,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  productAvailability: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  productAvailable: {
    backgroundColor: '#D1FAE5',
  },
  productUnavailable: {
    backgroundColor: '#FEE2E2',
  },
  productAvailabilityText: {
    fontSize: 14,
    fontWeight: '700',
  },
  productAvailableText: {
    color: '#065F46',
  },
  productUnavailableText: {
    color: '#991B1B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    maxWidth: 400,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalProductImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalProductName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalProductDescription: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
    textAlign: 'center',
  },
  modalPricing: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPriceLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  modalCredits: {
    fontSize: 18,
    fontWeight: '900',
  },
  sufficientCredits: {
    color: '#059669',
  },
  insufficientCredits: {
    color: '#DC2626',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: '#432870',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledPurchaseButton: {
    backgroundColor: '#D1D5DB',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  disabledPurchaseButtonText: {
    color: '#6B7280',
  },
});
