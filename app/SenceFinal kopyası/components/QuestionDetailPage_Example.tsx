/**
 * QuestionDetailPage - Quick Test Example
 * 
 * Bu dosya QuestionDetailPage component'ini hızlıca test etmek için kullanılabilir.
 * App.tsx içinde import edip kullanabilirsiniz.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QuestionDetailPage } from './QuestionDetailPage';

export function QuestionDetailPageExample() {
  const [showDetail, setShowDetail] = useState(true);

  const handleBack = () => {
    Alert.alert(
      'Geri Dön',
      'Ana sayfaya dönmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet', 
          onPress: () => {
            setShowDetail(false);
            // Gerçek uygulamada: navigation.goBack() veya setCurrentPage('home')
          }
        },
      ]
    );
  };

  const handleVote = (vote: 'yes' | 'no') => {
    Alert.alert(
      'Oy Verildi!',
      `Seçiminiz: ${vote === 'yes' ? 'EVET' : 'HAYIR'}\n\nKupona eklendi ve bahis onay sayfasına yönlendiriliyorsunuz...`,
      [
        {
          text: 'Tamam',
          onPress: () => {
            // Gerçek uygulamada:
            // - Kupona ekle
            // - Coupon drawer'ı aç
            // - veya bahis onay sayfasına yönlendir
            console.log('Vote added to coupon:', vote);
          }
        }
      ]
    );
  };

  if (!showDetail) {
    return (
      <View style={styles.container}>
        {/* Buraya ana sayfa veya önceki sayfa gelecek */}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QuestionDetailPage
        onBack={handleBack}
        onVote={handleVote}
        questionId={1} // Test için mock ID
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
});

// ============================================
// APP.TSX'E ENTEGRASYON ÖRNEĞİ
// ============================================

/*

// 1. Import
import { QuestionDetailPage } from './components/QuestionDetailPage';

// 2. State ekle
const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
const [currentPage, setCurrentPage] = useState<'home' | 'questionDetail'>('home');

// 3. Handler fonksiyonları
const handleQuestionDetail = (questionId: number) => {
  setSelectedQuestionId(questionId);
  setCurrentPage('questionDetail');
};

const handleVoteFromDetail = (vote: 'yes' | 'no') => {
  if (selectedQuestionId) {
    // Kupona ekle
    handleVote(
      selectedQuestionId,
      vote,
      vote === 'yes' ? 1.28 : 3.64, // Mock odds
      "Apple yeni iPhone 16'yı bu yıl piyasaya sürecek mi?" // Mock title
    );
    
    // Coupon drawer'ı aç
    setIsCouponDrawerOpen(true);
  }
};

// 4. Render
return (
  <SafeAreaProvider>
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <StatusBar barStyle="dark-content" />
        
        {currentPage === 'home' && (
          <NewHomePage
            onBack={() => {}}
            handleQuestionDetail={handleQuestionDetail}
            handleVote={handleVote}
            onMenuToggle={() => setIsMenuOpen(true)}
          />
        )}
        
        {currentPage === 'questionDetail' && (
          <QuestionDetailPage
            onBack={() => setCurrentPage('home')}
            onVote={handleVoteFromDetail}
            questionId={selectedQuestionId}
          />
        )}
        
        {/* Diğer sayfalar... *\/}
        
      </ThemeProvider>
    </GestureHandlerRootView>
  </SafeAreaProvider>
);

*/

// ============================================
// REACT NAVIGATION İLE KULLANIM
// ============================================

/*

// 1. Stack Navigator'a ekle
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  QuestionDetail: { questionId: number };
  // ... diğer sayfalar
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 2. Stack Screen olarak ekle
<Stack.Navigator>
  <Stack.Screen 
    name="Home" 
    component={HomeScreen}
    options={{ headerShown: false }}
  />
  <Stack.Screen 
    name="QuestionDetail" 
    component={QuestionDetailScreen}
    options={{ headerShown: false }}
  />
</Stack.Navigator>

// 3. QuestionDetailScreen component'i
function QuestionDetailScreen({ navigation, route }) {
  const { questionId } = route.params;
  
  return (
    <QuestionDetailPage
      onBack={() => navigation.goBack()}
      onVote={(vote) => {
        // Kupona ekle
        addToCoupon(questionId, vote);
        // Coupon sayfasına git veya drawer aç
        navigation.navigate('Coupon');
      }}
      questionId={questionId}
    />
  );
}

// 4. Ana sayfadan navigasyon
function HomeScreen({ navigation }) {
  return (
    <NewHomePage
      handleQuestionDetail={(questionId) => {
        navigation.navigate('QuestionDetail', { questionId });
      }}
      // ... diğer props
    />
  );
}

*/

// ============================================
// DEEP LINKING İLE KULLANIM
// ============================================

/*

// 1. Deep linking config
const linking = {
  prefixes: ['sence://', 'https://sence.app'],
  config: {
    screens: {
      Home: '',
      QuestionDetail: 'question/:questionId',
    },
  },
};

// 2. NavigationContainer'a ekle
<NavigationContainer linking={linking}>
  <Stack.Navigator>
    {/* ... *\/}
  </Stack.Navigator>
</NavigationContainer>

// 3. URL ile açma
// sence://question/123
// https://sence.app/question/123

*/

// ============================================
// API ENTEGRASYONU ÖRNEĞİ
// ============================================

/*

// services/api.ts
export const fetchQuestionDetail = async (questionId: number) => {
  try {
    const response = await fetch(`https://api.sence.app/questions/${questionId}`);
    const data = await response.json();
    return {
      mainQuestion: data,
      comments: data.comments,
      topInvestors: data.topInvestors,
      relatedQuestions: data.relatedQuestions,
      oddsHistory: data.oddsHistory,
    };
  } catch (error) {
    console.error('Error fetching question detail:', error);
    throw error;
  }
};

// Component içinde kullanım
import { fetchQuestionDetail } from '../services/api';

function QuestionDetailScreen({ route }) {
  const { questionId } = route.params;
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState(null);
  
  useEffect(() => {
    loadQuestionDetail();
  }, [questionId]);
  
  const loadQuestionDetail = async () => {
    try {
      setLoading(true);
      const data = await fetchQuestionDetail(questionId);
      setQuestionData(data);
    } catch (error) {
      Alert.alert('Hata', 'Soru detayları yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <QuestionDetailPage
      {...questionData}
      onBack={() => navigation.goBack()}
      onVote={handleVote}
    />
  );
}

*/

// ============================================
// STATE MANAGEMENT (REDUX) İLE KULLANIM
// ============================================

/*

// store/slices/questionSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchQuestionDetail = createAsyncThunk(
  'question/fetchDetail',
  async (questionId: number) => {
    const response = await api.getQuestionDetail(questionId);
    return response.data;
  }
);

const questionSlice = createSlice({
  name: 'question',
  initialState: {
    currentQuestion: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestionDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestion = action.payload;
      })
      .addCase(fetchQuestionDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Component içinde kullanım
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestionDetail } from '../store/slices/questionSlice';

function QuestionDetailScreen({ route }) {
  const dispatch = useDispatch();
  const { currentQuestion, loading } = useSelector(state => state.question);
  const { questionId } = route.params;
  
  useEffect(() => {
    dispatch(fetchQuestionDetail(questionId));
  }, [questionId]);
  
  if (loading) return <LoadingScreen />;
  
  return (
    <QuestionDetailPage
      {...currentQuestion}
      onBack={() => navigation.goBack()}
    />
  );
}

*/

export default QuestionDetailPageExample;

