import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

interface AuthenticationScreensProps {
  authScreen: 'welcome' | 'login' | 'signup';
  setAuthScreen: (screen: 'welcome' | 'login' | 'signup') => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export function AuthenticationScreens({
  authScreen,
  setAuthScreen,
  onLogin,
  onSignUp
}: AuthenticationScreensProps) {
  if (authScreen === 'welcome') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32
        }}>
          <Text style={{
            fontSize: 32,
            fontWeight: 'bold',
            color: '#432870',
            marginBottom: 16,
            textAlign: 'center'
          }}>
            Sence'e Hoş Geldiniz
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            marginBottom: 48,
            lineHeight: 24
          }}>
            Tahmin yap, kazan, eğlen!
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#432870',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
              marginBottom: 16,
              width: '100%',
              alignItems: 'center'
            }}
            onPress={() => setAuthScreen('login')}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Giriş Yap
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: '#432870',
              width: '100%',
              alignItems: 'center'
            }}
            onPress={() => setAuthScreen('signup')}
          >
            <Text style={{ color: '#432870', fontSize: 16, fontWeight: 'bold' }}>
              Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (authScreen === 'login') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#432870',
            marginBottom: 32,
            textAlign: 'center'
          }}>
            Giriş Yap
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#432870',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
              marginBottom: 16,
              width: '100%',
              alignItems: 'center'
            }}
            onPress={onLogin}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Demo Giriş
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 32,
              width: '100%',
              alignItems: 'center'
            }}
            onPress={() => setAuthScreen('welcome')}
          >
            <Text style={{ color: '#666', fontSize: 14 }}>
              Geri Dön
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (authScreen === 'signup') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 32
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#432870',
            marginBottom: 32,
            textAlign: 'center'
          }}>
            Kayıt Ol
          </Text>
          
          <TouchableOpacity
            style={{
              backgroundColor: '#432870',
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 12,
              marginBottom: 16,
              width: '100%',
              alignItems: 'center'
            }}
            onPress={onSignUp}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Demo Kayıt
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              paddingVertical: 16,
              paddingHorizontal: 32,
              width: '100%',
              alignItems: 'center'
            }}
            onPress={() => setAuthScreen('welcome')}
          >
            <Text style={{ color: '#666', fontSize: 14 }}>
              Geri Dön
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return null;
} 