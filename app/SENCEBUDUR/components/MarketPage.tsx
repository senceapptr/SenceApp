import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from './Header';

const { width } = Dimensions.get('window');

interface MarketPageProps {
  onBack: () => void;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: 'popular' | 'discounted';
  badgeText?: string;
}

export function MarketPage({ onBack, gameCredits, setProfileDrawerOpen, hasNotifications }: MarketPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: 'bag' },
    { id: 'electronics', name: 'Elektronik', icon: 'phone-portrait' },
    { id: 'home', name: 'Ev & Yaşam', icon: 'home' },
  ];

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro 16" M3',
      description: 'Apple M3 Pro chip, 18GB...',
      price: 5000000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
      category: 'electronics',
      badge: 'popular',
      badgeText: 'En Popüler'
    },
    {
      id: 2,
      name: 'Dyson V15 Detect',
      description: 'Laser teknolojisi ile kablos...',
      price: 1200000,
      originalPrice: 1500000,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
      category: 'home',
      badge: 'discounted',
      badgeText: 'İndirimli'
    }
  ];

  const allProducts: Product[] = [
    {
      id: 3,
      name: 'iPhone 15 Pro Max',
      description: 'Titanium, 256GB, Doğal...',
      price: 3500000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
      category: 'electronics'
    }
  ];

  const renderProductCard = (product: Product, isFeatured: boolean = false) => (
    <View key={product.id} style={{
      backgroundColor: 'white',
      borderRadius: 16,
      marginRight: isFeatured ? 16 : 0,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      width: isFeatured ? 280 : '100%',
    }}>
      {/* Product Image */}
      <View style={{ position: 'relative' }}>
        <View style={{
          width: '100%',
          height: isFeatured ? 160 : 120,
          backgroundColor: '#F2F3F5',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="image" size={48} color="#999" />
        </View>
        
        {/* Badge */}
        {product.badge && (
          <View style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: '#432870',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          }}>
            <Text style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold',
            }}>
              {product.badgeText}
            </Text>
          </View>
        )}
      </View>
      
      {/* Product Info */}
      <View style={{ padding: 16 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#202020',
          marginBottom: 4,
        }}>
          {product.name}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 12,
        }}>
          {product.description}
        </Text>
        
        {/* Price */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          {product.originalPrice && (
            <Text style={{
              fontSize: 14,
              color: '#999',
              textDecorationLine: 'line-through',
              marginRight: 8,
            }}>
              {product.originalPrice.toLocaleString()}
            </Text>
          )}
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#3B82F6',
          }}>
            {product.price.toLocaleString()}
          </Text>
          <Ionicons name="diamond" size={16} color="#3B82F6" style={{ marginLeft: 4 }} />
        </View>
        
        {/* Action Button */}
        <TouchableOpacity style={{
          backgroundColor: '#FFE4E6',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: 'center',
        }}>
          <Text style={{
            color: '#DC2626',
            fontSize: 14,
            fontWeight: 'bold',
          }}>
            X Yetersiz
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      
      <Header 
        variant="market"
        gameCredits={gameCredits}
        setProfileDrawerOpen={setProfileDrawerOpen}
        hasNotifications={hasNotifications}
        onBack={onBack}
        title="Market"
        subtitle="Kredilerinle gerçek ürünler kazan"
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Category Tabs */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={{
                  backgroundColor: selectedCategory === category.id ? '#432870' : 'white',
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 20,
                  marginRight: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? 'white' : '#202020'}
                  style={{ marginRight: 8 }}
                />
                <Text style={{
                  color: selectedCategory === category.id ? 'white' : '#202020',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Section */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#202020' }}>
              ✩ Öne Çıkanlar
            </Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredProducts.map((product) => renderProductCard(product, true))}
          </ScrollView>
        </View>

        {/* All Products */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
          {allProducts.map((product) => renderProductCard(product, false))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 