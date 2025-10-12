import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    image: string;
    yesPercentage: number;
    votes: string;
    timeLeft: string;
    yesOdds: number;
    noOdds: number;
  };
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  isExpanded?: boolean;
  onToggleExpansion?: () => void;
  isCompact?: boolean;
  style?: any;
}

export function QuestionCard({ 
  question,
  onQuestionClick,
  onVote,
  isExpanded,
  onToggleExpansion,
  isCompact = false,
  style
}: QuestionCardProps) {
  
  const CircularProgress = ({ percentage, size = 60 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <View style={{ width: size, height: size, position: 'relative' }}>
        {/* Background circle */}
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: '#F2F3F5',
          position: 'absolute'
        }} />
        
        {/* Progress circle */}
        <View style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 4,
          borderColor: '#432870',
          borderLeftColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: '-90deg' }],
          position: 'absolute'
        }} />
        
        {/* Percentage text */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: size * 0.2,
            fontWeight: 'bold',
            color: '#432870'
          }}>
            {percentage}%
          </Text>
        </View>
      </View>
    );
  };

  if (isCompact) {
    return (
      <TouchableOpacity
        onPress={() => onQuestionClick(question.id)}
        style={[{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2
        }, style]}
        activeOpacity={0.8}
      >
        {/* Question Title */}
        <Text style={{
          color: '#202020',
          fontWeight: 'bold',
          fontSize: 12,
          lineHeight: 16,
          marginBottom: 8
        }}>
          {question.title}
        </Text>
        
        {/* Circular Progress - Centered */}
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <CircularProgress percentage={question.yesPercentage} size={50} />
        </View>
        
        {/* Vote and Time Info */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle" size={12} color="#666" />
            <Text style={{
              color: '#666',
              fontSize: 10,
              marginLeft: 4
            }}>
              {question.votes}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="time" size={12} color="#666" />
            <Text style={{
              color: '#666',
              fontSize: 10,
              marginLeft: 4
            }}>
              {question.timeLeft}
            </Text>
          </View>
        </View>

        {/* Compact Voting Buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => onVote(question.id, 'yes', question.yesOdds)}
            style={{
              flex: 1,
              backgroundColor: '#00AA44',
              paddingVertical: 8,
              paddingHorizontal: 6,
              borderRadius: 8,
              alignItems: 'center'
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>
              EVET
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 8 }}>
              {question.yesOdds}x
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onVote(question.id, 'no', question.noOdds)}
            style={{
              flex: 1,
              backgroundColor: '#DC2626',
              paddingVertical: 8,
              paddingHorizontal: 6,
              borderRadius: 8,
              alignItems: 'center'
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>
              HAYIR
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 8 }}>
              {question.noOdds}x
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onQuestionClick(question.id)}
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16
      }}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
        {/* Question Text - Left Side */}
        <View style={{ flex: 1 }}>
          <Text style={{
            color: '#202020',
            fontWeight: 'bold',
            fontSize: 16,
            lineHeight: 22,
            marginBottom: 8
          }}>
            {question.title}
          </Text>
          
          {/* Vote and Time Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="people" size={14} color="#666" />
              <Text style={{
                color: '#666',
                fontSize: 12,
                marginLeft: 4
              }}>
                {question.votes}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time" size={14} color="#666" />
              <Text style={{
                color: '#666',
                fontSize: 12,
                marginLeft: 4
              }}>
                {question.timeLeft}
              </Text>
            </View>
          </View>
        </View>

        {/* Circular Progress - Right Side */}
        <View style={{ alignItems: 'center' }}>
          <CircularProgress percentage={question.yesPercentage} />
          <Text style={{
            color: '#666',
            fontSize: 10,
            marginTop: 4
          }}>
            hayır
          </Text>
        </View>
      </View>

      {/* Voting Buttons */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={() => onVote(question.id, 'yes', question.yesOdds)}
          style={{
            flex: 1,
            backgroundColor: '#00AA44',
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center'
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
            EVET
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
            {question.yesOdds}x
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onVote(question.id, 'no', question.noOdds)}
          style={{
            flex: 1,
            backgroundColor: '#DC2626',
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: 'center'
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
            HAYIR
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12 }}>
            {question.noOdds}x
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
} 