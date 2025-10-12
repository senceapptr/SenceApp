import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WriteQuestionPageProps {
  onBack: () => void;
}

interface SubmittedQuestion {
  id: number;
  question: string;
  context: string;
  status: 'approved' | 'pending' | 'rejected';
  submittedDate: string;
  endDate: string;
  rejectionReason?: string;
}

export function WriteQuestionPage({ onBack }: WriteQuestionPageProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'status'>('write');
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');

  const submittedQuestions: SubmittedQuestion[] = [
    {
      id: 1,
      question: '2024 yılında Türkiye\'de elektrikli araç satışları %50 artacak mı?',
      context: 'Türkiye\'de elektrikli araç pazarının büyüme trendi devam edecek mi?',
      status: 'approved',
      submittedDate: '15 Ocak 2024',
      endDate: '31 Aralık 2024'
    },
    {
      id: 2,
      question: 'ChatGPT-5 2024 yılında çıkacak mı?',
      context: 'OpenAI\'ın yeni modeli bu yıl piyasaya çıkacak mı?',
      status: 'pending',
      submittedDate: '20 Ocak 2024',
      endDate: '31 Aralık 2024'
    },
    {
      id: 3,
      question: 'Bitcoin 2024\'te 100.000$ seviyesini görecek mi?',
      context: 'Kripto para piyasasındaki gelişmeler',
      status: 'rejected',
      submittedDate: '10 Ocak 2024',
      endDate: '31 Aralık 2024',
      rejectionReason: 'Soru çok spekülatif ve belirsiz kriterler içeriyor.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Onaylandı';
      case 'pending': return 'Bekliyor';
      case 'rejected': return 'Reddedildi';
      default: return 'Bilinmiyor';
    }
  };

  const renderWriteTab = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '900',
          color: '#202020',
          marginBottom: 8,
        }}>
          Yeni Soru Oluştur
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 24,
          lineHeight: 20,
        }}>
          Sorun incelendikten sonra yayınlanacak. Topluluk kurallarına uygun sorular yazın.
        </Text>

        {/* Question Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#202020',
            marginBottom: 8,
          }}>
            Soru *
          </Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder="Örn: 2024 yılında Bitcoin 100.000$ seviyesini aşacak mı?"
            style={{
              backgroundColor: '#F2F3F5',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              minHeight: 60,
              textAlignVertical: 'top',
            }}
            multiline
            maxLength={200}
          />
          <Text style={{
            fontSize: 12,
            color: '#999',
            textAlign: 'right',
            marginTop: 4,
          }}>
            {question.length}/200
          </Text>
        </View>

        {/* Description Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#202020',
            marginBottom: 8,
          }}>
            Soru Açıklaması *
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Sorunuz hakkında daha detaylı bilgi verin. Kriterler ve koşulları açıklayın."
            style={{
              backgroundColor: '#F2F3F5',
              borderRadius: 12,
              padding: 16,
              fontSize: 16,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            multiline
            maxLength={500}
          />
          <Text style={{
            fontSize: 12,
            color: '#999',
            textAlign: 'right',
            marginTop: 4,
          }}>
            {description.length}/500
          </Text>
        </View>

        {/* End Date Field */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#202020',
            marginBottom: 8,
          }}>
            Bitiş Tarihi *
          </Text>
          <View style={{
            backgroundColor: '#F2F3F5',
            borderRadius: 12,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <TextInput
              value={endDate}
              onChangeText={setEndDate}
              placeholder="gg.aa.yyyy"
              style={{
                fontSize: 16,
                flex: 1,
              }}
            />
            <Ionicons name="calendar" size={20} color="#666" />
          </View>
        </View>

        {/* Options Section */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Ionicons name="locate" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#202020',
            }}>
              Seçenekler
            </Text>
          </View>
          
          <View style={{ paddingLeft: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#10B981',
                marginRight: 12,
              }} />
              <Text style={{ fontSize: 14, color: '#202020' }}>
                EVET - Sorunuzun gerçekleşeceğini düşünenler
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#EF4444',
                marginRight: 12,
              }} />
              <Text style={{ fontSize: 14, color: '#202020' }}>
                HAYIR - Sorunuzun gerçekleşmeyeceğini düşünenler
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderStatusTab = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '900',
          color: '#202020',
          marginBottom: 24,
        }}>
          Gönderdiğin Sorular
        </Text>

        {submittedQuestions.map((item) => (
          <View key={item.id} style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#202020',
              marginBottom: 8,
            }}>
              {item.question}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              marginBottom: 12,
            }}>
              {item.context}
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: getStatusColor(item.status),
                marginRight: 8,
              }} />
              <Text style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: getStatusColor(item.status),
              }}>
                {getStatusText(item.status)}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#999' }}>
                Gönderilme: {item.submittedDate}
              </Text>
              <Text style={{ fontSize: 12, color: '#999' }}>
                Bitiş: {item.endDate}
              </Text>
            </View>
            
            {item.rejectionReason && (
              <View style={{
                backgroundColor: '#FEF2F2',
                borderWidth: 1,
                borderColor: '#FECACA',
                borderRadius: 8,
                padding: 12,
                marginTop: 8,
              }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#EF4444',
                  marginBottom: 4,
                }}>
                  Red Sebebi:
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#EF4444',
                }}>
                  {item.rejectionReason}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
      }}>
        <TouchableOpacity
          onPress={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#F2F3F5',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#202020" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '900',
            color: '#202020',
            marginBottom: 4,
          }}>
            Soru Yaz
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            Toplulukla paylaşmak istediğin soruları yaz
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
      }}>
        <TouchableOpacity
          onPress={() => setActiveTab('write')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: activeTab === 'write' ? '#432870' : 'white',
          }}
        >
          <Ionicons
            name="create"
            size={16}
            color={activeTab === 'write' ? 'white' : '#666'}
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: activeTab === 'write' ? 'white' : '#666',
          }}>
            Soru Yaz
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('status')}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: activeTab === 'status' ? '#432870' : 'white',
          }}
        >
          <Ionicons
            name="clipboard"
            size={16}
            color={activeTab === 'status' ? 'white' : '#666'}
            style={{ marginRight: 8 }}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: activeTab === 'status' ? 'white' : '#666',
          }}>
            Durumlar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'write' ? renderWriteTab() : renderStatusTab()}
    </SafeAreaView>
  );
} 