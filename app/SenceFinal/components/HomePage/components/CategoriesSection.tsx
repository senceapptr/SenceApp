import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { categoriesService } from '@/services/categories.service';
import { CategoryQuestionsPage } from '../../CategoryQuestionsPage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CategoriesSectionProps {
  isDarkMode: boolean;
  theme: any;
  onCategorySelect: (categoryId: string, categoryName: string, categoryIcon: string) => void;
  onMenuToggle: () => void;
  handleQuestionDetail: (questionId: string) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'spor': '#10B981',        // Yeşil
  'eglence': '#F59E0B',     // Turuncu
  'finans': '#10B981',      // Yeşil
  'magazin': '#EC4899',     // Pembe
  'sosyal-medya': '#3B82F6', // Mavi
  'politika': '#8B5CF6',    // Mor
  'teknoloji': '#06B6D4',   // Cyan
  'sinema': '#DC2626',      // Kırmızı
  'global': '#10B981',      // Yeşil
};

export function CategoriesSection({
  isDarkMode,
  theme,
  onCategorySelect,
  onMenuToggle,
  handleQuestionDetail,
  handleVote,
}: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await categoriesService.getActiveCategories();
      if (error) {
        console.error('Load categories error:', error);
        return;
      }
      setCategories(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category.id);
    setIsAnimating(true);
    slideAnim.setValue(SCREEN_WIDTH);
    
    setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);
      });
    }, 100);
  };

  const handleCategoryClose = () => {
    console.log('handleCategoryClose called');
    setIsAnimating(true);
    Animated.spring(slideAnim, {
      toValue: SCREEN_WIDTH,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
    }).start(() => {
      console.log('Animation finished, closing modal');
      setSelectedCategory(null);
      setIsAnimating(false);
    });
  };

  if (categories.length === 0) return null;

  return (
    <>
      <View style={styles.section}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category, index) => {
            const categoryColor = CATEGORY_COLORS[category.slug] || theme.accent;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: categoryColor + '15',
                    borderColor: categoryColor + '40',
                  },
                ]}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{category.icon || '📌'}</Text>
                <Text style={[styles.categoryName, { color: categoryColor }]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Category Questions Page Overlay */}
      {selectedCategory && (
        <Animated.View
          pointerEvents={isAnimating ? 'none' : 'auto'}
          style={[
            styles.modalContainer,
            {
              backgroundColor: '#0D1117',
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <CategoryQuestionsPage
            category={{
              id: selectedCategory,
              label: categories.find(c => c.id === selectedCategory)?.name || 'Kategori',
              icon: categories.find(c => c.id === selectedCategory)?.icon || '📌',
              color: CATEGORY_COLORS[categories.find(c => c.id === selectedCategory)?.slug || ''] || theme.accent,
            }}
            onBack={handleCategoryClose}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
            onMenuToggle={onMenuToggle}
          />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
  },
  categoriesContainer: {
    gap: 8,
    paddingRight: 20,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '700',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
