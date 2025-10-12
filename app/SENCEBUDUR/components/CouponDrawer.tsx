import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface CouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selections: any[];
  onRemoveSelection: (id: number) => void;
  onClearAll: () => void;
  isFree?: boolean;
}

export function CouponDrawer({ 
  isOpen, 
  onClose, 
  selections, 
  onRemoveSelection, 
  onClearAll,
  isFree = false
}: CouponDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isOpen, slideAnim]);

  const totalOdds = selections.reduce((acc, selection) => acc * selection.odds, 1);
  const potentialWin = totalOdds * 10; // Standard calculation without free kupon logic

  const handleSubmit = async () => {
    if (selections.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success message
    alert('Kupon başarıyla oluşturuldu! 🎉');
    
    setIsSubmitting(false);
    onClearAll();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop with blur effect */}
        <TouchableOpacity 
          style={styles.backdrop} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        {/* Drawer */}
        <Animated.View 
          style={[
            styles.drawer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Handle */}
          <View style={styles.handle}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Text style={styles.headerIconText}>🎯</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>Kuponum</Text>
                <Text style={styles.headerSubtitle}>
                  {selections.length}/5 tahmin
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color="#202020" />
            </TouchableOpacity>
          </View>

          {selections.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>🎯</Text>
              </View>
              <Text style={styles.emptyTitle}>Kuponun Boş</Text>
              <Text style={styles.emptySubtitle}>
                Tahmin yapmak için sorulara evet veya hayır diyerek kuponunu oluştur.
              </Text>
            </View>
          ) : (
            <>
              {/* Selections List */}
              <ScrollView 
                style={styles.selectionsList} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.selectionsContent}
              >
                {selections.map((selection) => (
                  <View 
                    key={selection.id} 
                    style={styles.selectionCard}
                  >
                    <View style={styles.selectionContent}>
                      <View style={styles.selectionInfo}>
                        <Text style={styles.selectionTitle}>
                          {selection.title}
                        </Text>
                        <View style={styles.selectionMeta}>
                          <View style={[
                            styles.votePill,
                            selection.vote === 'yes' ? styles.yesPill : styles.noPill
                          ]}>
                            <Text style={[
                              styles.voteText,
                              selection.vote === 'yes' ? styles.yesText : styles.noText
                            ]}>
                              {selection.vote === 'yes' ? 'EVET' : 'HAYIR'}
                            </Text>
                          </View>
                          <Text style={styles.oddsText}>
                            {selection.odds}x
                          </Text>
                          {selection.boosted && (
                            <View style={styles.boostBadge}>
                              <Text style={styles.boostText}>BOOST</Text>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        onPress={() => onRemoveSelection(selection.id)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Summary */}
              <View style={styles.summary}>
                <View style={styles.summaryCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Toplam Oran</Text>
                    <Text style={styles.summaryValue}>
                      {totalOdds.toFixed(2)}x
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Bahis Tutarı</Text>
                    <Text style={styles.betAmount}>10 kredi</Text>
                  </View>
                  <View style={[styles.summaryRow, styles.summaryRowBorder]}>
                    <Text style={styles.summaryLabel}>Potansiyel Kazanç</Text>
                    <Text style={styles.potentialWin}>
                      {Math.round(potentialWin)} kredi
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    onPress={onClearAll}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearButtonText}>Temizle</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting || selections.length === 0}
                    style={[
                      styles.createButton,
                      (isSubmitting || selections.length === 0) && styles.disabledButton
                    ]}
                  >
                    {isSubmitting ? (
                      <View style={styles.loadingContainer}>
                        <View style={styles.loadingSpinner} />
                        <Text style={styles.loadingText}>Oluşturuluyor...</Text>
                      </View>
                    ) : (
                      <Text style={styles.createButtonText}>Kupon Oluştur</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  drawer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  handleBar: {
    width: 48,
    height: 6,
    backgroundColor: '#F2F3F5',
    borderRadius: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#432870',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 20,
  },
  headerInfo: {
    gap: 2,
  },
  headerTitle: {
    color: '#202020',
    fontWeight: '900',
    fontSize: 20,
  },
  headerSubtitle: {
    color: '#432870',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    color: '#202020',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectionsList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    maxHeight: 320,
  },
  selectionsContent: {
    paddingBottom: 16,
  },
  selectionCard: {
    backgroundColor: '#F2F3F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(67, 40, 112, 0.1)',
  },
  selectionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  selectionInfo: {
    flex: 1,
  },
  selectionTitle: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  selectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  votePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  yesPill: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  noPill: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  voteText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  yesText: {
    color: '#16a34a',
  },
  noText: {
    color: '#dc2626',
  },
  oddsText: {
    color: '#432870',
    fontWeight: '900',
    fontSize: 12,
  },
  boostBadge: {
    backgroundColor: '#432870',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  boostText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    padding: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(67, 40, 112, 0.1)',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(67, 40, 112, 0.2)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F2F3F5',
    paddingTop: 12,
    marginBottom: 0,
  },
  summaryLabel: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 14,
  },
  summaryValue: {
    color: '#432870',
    fontWeight: '900',
    fontSize: 20,
  },
  betAmount: {
    color: '#B29EFD',
    fontWeight: '900',
    fontSize: 18,
  },
  potentialWin: {
    color: '#432870',
    fontWeight: '900',
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createButton: {
    flex: 2,
    backgroundColor: '#432870',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: 'white',
    borderTopColor: 'transparent',
    borderRadius: 8,
    animationName: 'spin',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
  },
}); 