import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProductsList
          products={filteredProducts}
          userCredits={userCredits}
          selectedCategory={selectedCategory}
          categoryName={categoryName}
          onProductPress={handleProductPress}
        />
      </ScrollView>

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
});

export default MarketPage;

