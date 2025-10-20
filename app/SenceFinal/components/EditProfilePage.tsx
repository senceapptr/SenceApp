import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface UserProfile {
  username: string;
  fullName: string;
  bio: string;
  email: string;
  profileImage: string;
  coverImage: string;
}

interface EditProfilePageProps {
  onBack: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: Partial<UserProfile>) => void;
}

export function EditProfilePage({ onBack, userProfile, onUpdateProfile }: EditProfilePageProps) {
  const { theme, isDarkMode } = useTheme();
  const [profileData, setProfileData] = useState<UserProfile>(userProfile);

  const handleSave = () => {
    if (!profileData.username.trim() || !profileData.email.trim() || !profileData.fullName.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı, isim ve e-posta zorunludur.');
      return;
    }

    onUpdateProfile(profileData);
    Alert.alert('✅ Başarılı', 'Profil bilgilerin güncellendi!', [
      { text: 'Tamam', onPress: onBack }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: theme.hover }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Profili Düzenle</Text>
        
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#432870', '#B29EFD']}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cover Photo Section */}
        <View style={styles.coverPhotoSection}>
          <Image 
            source={{ uri: profileData.coverImage }}
            style={styles.coverPhoto}
          />
          <TouchableOpacity style={styles.editCoverButton} activeOpacity={0.8}>
            <View style={styles.editCoverButtonInner}>
              <Ionicons name="camera" size={18} color="white" />
              <Text style={styles.editCoverText}>Kapak Fotoğrafı</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profileData.profileImage }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editPhotoButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                style={styles.editPhotoGradient}
              >
                <Ionicons name="camera" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={[styles.photoHint, { color: theme.textMuted }]}>
            Profil fotoğrafını değiştir
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
              Kullanıcı Adı *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.inputPrefix, { color: theme.textMuted }]}>@</Text>
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={profileData.username}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, username: text }))}
                placeholder="kullanici_adi"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
              İsim *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={profileData.fullName}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, fullName: text }))}
                placeholder="İsim Soyisim"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
              Biyografi
            </Text>
            <View style={[styles.textAreaContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <TextInput
                style={[styles.textArea, { color: theme.textPrimary }]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                placeholder="Kendinden bahset..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={4}
                maxLength={150}
              />
            </View>
            <Text style={[styles.charCount, { color: theme.textMuted }]}>
              {profileData.bio.length}/150
            </Text>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
              E-posta *
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.textPrimary }]}
                value={profileData.email}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                placeholder="email@example.com"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: theme.hover, borderColor: theme.border }]}>
            <Ionicons name="information-circle" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              * işaretli alanlar zorunludur
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  saveButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  coverPhotoSection: {
    position: 'relative',
    height: 140,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  editCoverButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  editCoverText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  photoSection: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
    marginTop: -40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'white',
  },
  editPhotoGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoHint: {
    fontSize: 14,
    color: '#6B7280',
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 24,
    paddingBottom: 40,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  textAreaContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  textArea: {
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
});

