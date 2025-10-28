import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { adminService, AdminStats, PendingQuestion, User } from '@/services/admin.service';
import { AdminHeader } from './components/AdminHeader';
import { StatsCard } from './components/StatsCard';
import { PendingQuestionsList } from './components/PendingQuestionsList';
import { UsersList } from './components/UsersList';
import { EditQuestionModal } from './components/EditQuestionModal';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'questions' | 'users'>('stats');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingQuestions, setPendingQuestions] = useState<PendingQuestion[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PendingQuestion | null>(null);

  // Admin yetkisi kontrolü
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    const { isAdmin, error } = await adminService.isAdmin(user.id);
    
    if (error) {
      Alert.alert('Hata', 'Admin yetkisi kontrol edilemedi');
      return;
    }

    if (!isAdmin) {
      Alert.alert('Yetki Hatası', 'Bu sayfaya erişim yetkiniz yok');
      onBack();
      return;
    }

    setIsAdmin(true);
    loadData();
  };

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Stats yükle
      if (activeTab === 'stats') {
        const { data: statsData, error: statsError } = await adminService.getStats();
        if (statsError) throw statsError;
        setStats(statsData);
      }

      // Pending questions yükle
      if (activeTab === 'questions') {
        const { data: questionsData, error: questionsError } = await adminService.getPendingQuestions();
        if (questionsError) throw questionsError;
        setPendingQuestions(questionsData || []);
      }

      // Users yükle
      if (activeTab === 'users') {
        const { data: usersData, error: usersError } = await adminService.getUsers();
        if (usersError) throw usersError;
        setUsers(usersData || []);
      }

    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleTabChange = (tab: 'stats' | 'questions' | 'users') => {
    setActiveTab(tab);
    loadData();
  };

  const handleQuestionApprove = async (questionId: string) => {
    try {
      const { error } = await adminService.approveQuestion(questionId);
      
      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      Alert.alert('Başarılı', 'Soru onaylandı');
      loadData(); // Verileri yenile
    } catch (error) {
      console.error('Approve question error:', error);
      Alert.alert('Hata', 'Soru onaylanırken bir hata oluştu');
    }
  };

  const handleQuestionReject = async (questionId: string) => {
    Alert.prompt(
      'Soru Reddet',
      'Red sebebini belirtin:',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Reddet',
          onPress: async (reason) => {
            if (!reason?.trim()) {
              Alert.alert('Hata', 'Red sebebi belirtilmelidir');
              return;
            }

            try {
              const { error } = await adminService.rejectQuestion(questionId, reason);
              
              if (error) {
                Alert.alert('Hata', error.message);
                return;
              }

              Alert.alert('Başarılı', 'Soru reddedildi');
              loadData(); // Verileri yenile
            } catch (error) {
              console.error('Reject question error:', error);
              Alert.alert('Hata', 'Soru reddedilirken bir hata oluştu');
            }
          }
        }
      ]
    );
  };

  const handleUserBanToggle = async (userId: string, isBanned: boolean) => {
    const action = isBanned ? 'aktifleştir' : 'banla';
    
    Alert.alert(
      'Kullanıcı Yönetimi',
      `Kullanıcıyı ${action}mak istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: isBanned ? 'default' : 'destructive',
          onPress: async () => {
            try {
              const { error } = await adminService.toggleUserBan(userId, !isBanned);
              
              if (error) {
                Alert.alert('Hata', error.message);
                return;
              }

              Alert.alert('Başarılı', `Kullanıcı ${action}ıldı`);
              loadData(); // Verileri yenile
            } catch (error) {
              console.error('Toggle user ban error:', error);
              Alert.alert('Hata', `Kullanıcı ${action}ırken bir hata oluştu`);
            }
          }
        }
      ]
    );
  };

  const handleQuestionImageUpdate = async (questionId: string, imageUrl: string) => {
    try {
      const { error } = await adminService.updateQuestionImage(questionId, imageUrl);
      
      if (error) {
        Alert.alert('Hata', 'Görsel güncellenirken bir hata oluştu');
        return;
      }

      Alert.alert('Başarılı', 'Soru görseli güncellendi');
      loadData(); // Verileri yenile
    } catch (error) {
      console.error('Update question image error:', error);
      Alert.alert('Hata', 'Görsel güncellenirken bir hata oluştu');
    }
  };

  const handleQuestionEdit = (question: PendingQuestion) => {
    setEditingQuestion(question);
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setEditingQuestion(null);
  };

  const handleEditSave = () => {
    loadData(); // Verileri yenile
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#432870" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#432870" />
          <Text style={styles.loadingText}>Yetki kontrol ediliyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      
      <AdminHeader onBack={onBack} />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => handleTabChange('stats')}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={activeTab === 'stats' ? '#432870' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            İstatistikler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
          onPress={() => handleTabChange('questions')}
        >
          <Ionicons 
            name="help-circle" 
            size={20} 
            color={activeTab === 'questions' ? '#432870' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'questions' && styles.activeTabText]}>
            Sorular ({pendingQuestions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => handleTabChange('users')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'users' ? '#432870' : '#6B7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Kullanıcılar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#432870" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'stats' && stats && (
              <StatsCard stats={stats} />
            )}

            {activeTab === 'questions' && (
              <PendingQuestionsList
                questions={pendingQuestions}
                onApprove={handleQuestionApprove}
                onReject={handleQuestionReject}
                onUpdateImage={handleQuestionImageUpdate}
                onEdit={handleQuestionEdit}
              />
            )}

            {activeTab === 'users' && (
              <UsersList
                users={users}
                onBanToggle={handleUserBanToggle}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Edit Question Modal */}
      <EditQuestionModal
        visible={editModalVisible}
        question={editingQuestion}
        onClose={handleEditModalClose}
        onSave={handleEditSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#F3F4F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#432870',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
