import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'react-native';
import { MarketPageProps } from './types';
import { useMarket } from './hooks';
import { PageHeader } from './components/PageHeader';
import { CategoriesBar } from './components/CategoriesBar';
import { ProductsList } from './components/ProductsList';
import { PurchaseModal } from './components/PurchaseModal';
import { EmptyState } from './components/EmptyState';

export function MarketPage({ onBack, userCredits }: MarketPageProps) {
  const {
    selectedCategory,
    showPurchaseModal,
    selectedProduct,
    categories,
    filteredProducts,
    categoryName,
    loading,
    purchaseLoading,
    errorMessage,
    setSelectedCategory,
    handleProductPress,
    handleCloseModal,
    handleConfirmPurchase,
    retryLoadMarketData,
  } = useMarket();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      <PageHeader onBack={onBack} />
      
      <CategoriesBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#256EFF" />
          <Text style={styles.loadingText}>Market yükleniyor...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <EmptyState
            iconName="warning-outline"
            message={errorMessage}
            actionLabel="Tekrar Dene"
            onAction={retryLoadMarketData}
          />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <ProductsList
            products={filteredProducts}
            userCredits={userCredits}
            selectedCategory={selectedCategory}
            categoryName={categoryName}
            onProductPress={handleProductPress}
          />
        </ScrollView>
      )}

      <PurchaseModal
        visible={showPurchaseModal}
        product={selectedProduct}
        userCredits={userCredits}
        purchaseLoading={purchaseLoading}
        onClose={handleCloseModal}
        onConfirm={shippingAddress => handleConfirmPurchase(userCredits, shippingAddress)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});

export default MarketPage;
