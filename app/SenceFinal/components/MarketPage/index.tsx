import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { StatusBar } from 'react-native';
import { MarketPageProps } from './types';
import { useMarket } from './hooks';
import { PageHeader } from './components/PageHeader';
import { CategoriesBar } from './components/CategoriesBar';
import { ProductsList } from './components/ProductsList';
import { PurchaseModal } from './components/PurchaseModal';

export function MarketPage({ onBack, onMenuToggle, userCredits }: MarketPageProps) {
  const {
    selectedCategory,
    showPurchaseModal,
    selectedProduct,
    categories,
    filteredProducts,
    categoryName,
    loading,
    setSelectedCategory,
    handleProductPress,
    handleCloseModal,
    handleConfirmPurchase,
  } = useMarket();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      
      <PageHeader onBack={onBack} onMenuToggle={onMenuToggle} />
      
      <CategoriesBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#432870" />
          <Text style={styles.loadingText}>Market yükleniyor...</Text>
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
        onClose={handleCloseModal}
        onConfirm={() => handleConfirmPurchase(userCredits)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
  },
});

export default MarketPage;

