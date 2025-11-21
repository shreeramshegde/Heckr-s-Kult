import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  TouchableOpacity
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import GlowButton from '../components/GlowButton';
import Input from '../components/Input';
import api from '../services/api';
import { spacing, borderRadius } from '../theme/theme';

const MatchesScreen = ({ route, navigation }) => {
  const { matches } = route.params;
  const { colors } = useTheme();
  
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const handleClaimPress = (match) => {
    setSelectedMatch(match);
    setSecurityAnswer('');
    setClaimModalVisible(true);
  };

  const handleClaim = async () => {
    if (!securityAnswer.trim()) {
      Alert.alert('Error', 'Please provide an answer');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post(`/posts/${selectedMatch.post._id}/claim`, {
        answer: securityAnswer
      });
      
      if (response.data.success) {
        const contact = response.data.foundOwnerContact;
        Alert.alert(
          '✅ Claim Successful!',
          `Finder Details:\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'Not provided'}\n\nBoth of you have been notified with contact details.`,
          [{ text: 'OK', onPress: () => {
            setClaimModalVisible(false);
            setSecurityAnswer('');
            navigation.navigate('Found');
          }}]
        );
      } else {
        const attemptsRemaining = response.data.attemptsLeft;
        setAttemptsLeft(attemptsRemaining);
        
        if (attemptsRemaining === 0) {
          Alert.alert(
            '❌ Maximum Attempts Reached',
            'You have used all 3 attempts for this item.',
            [{ text: 'OK', onPress: () => {
              setClaimModalVisible(false);
              setSecurityAnswer('');
            }}]
          );
        } else {
          Alert.alert(
            '❌ Incorrect Answer',
            `${response.data.message}\n\nAttempts left: ${attemptsRemaining}/3`
          );
          setSecurityAnswer('');
        }
      }
    } catch (error) {
      console.error('Claim error:', error);
      
      if (error.response?.status === 403) {
        Alert.alert(
          '❌ Maximum Attempts Reached',
          error.response.data.message || 'You have used all 3 attempts.',
          [{ text: 'OK', onPress: () => {
            setClaimModalVisible(false);
            setSecurityAnswer('');
          }}]
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || 'Failed to claim');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, { borderColor: colors.neonBlue }]}>
          <Text style={[styles.headerTitle, { color: colors.neonBlue }]}>
            🎯 Found {matches.length} Match{matches.length !== 1 ? 'es' : ''}!
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            These found items match your lost item. Answer the security question to claim.
          </Text>
        </View>

        {matches.map((match, index) => {
          const post = match.post;
          const matchPercent = Math.round(match.score * 100);
          
          return (
            <View 
              key={post._id} 
              style={[styles.matchCard, { 
                backgroundColor: colors.darkBgSecondary, 
                borderColor: colors.border 
              }]}
            >
              {/* Match Badge */}
              <View style={[styles.matchBadge, { backgroundColor: colors.neonBlueGlow }]}>
                <Text style={[styles.matchPercent, { color: colors.neonBlue }]}>
                  {matchPercent}% Match
                </Text>
              </View>

              {/* Image */}
              {post.image && (() => {
                const uri = (typeof post.image === 'string' && (post.image.startsWith('http') || post.image.startsWith('file') || post.image.startsWith('data:')))
                  ? post.image
                  : `http://192.168.0.198:5000/${post.image}`;

                return (
                  <Image
                    source={{ uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                );
              })()}

              {/* Item Details */}
              <View style={styles.details}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {post.title}
                </Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {post.description}
                </Text>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Category:</Text>
                  <Text style={[styles.infoValue, { color: colors.neonBlue }]}>
                    {post.category}
                  </Text>
                </View>

                {post.color && (
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Color:</Text>
                    <View style={styles.colorInfo}>
                      <View style={[styles.colorDot, { backgroundColor: post.color.toLowerCase() }]} />
                      <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                        {post.color}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Location:</Text>
                  <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                    {post.location}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Date:</Text>
                  <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                    {formatDate(post.dateTime)}
                  </Text>
                </View>

                {/* Claim Button */}
                <GlowButton
                  title="It's Mine! 🎯"
                  onPress={() => handleClaimPress(match)}
                  style={styles.claimButton}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Claim Modal */}
      <Modal
        visible={claimModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClaimModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.darkBgSecondary }]}>
            <Text style={[styles.modalTitle, { color: colors.neonBlue }]}>
              Answer Security Question
            </Text>
            
            {selectedMatch && (
              <>
                <Text style={[styles.modalQuestion, { color: colors.textPrimary }]}>
                  {selectedMatch.post.securityQuestion}
                </Text>
                
                <Input
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChangeText={setSecurityAnswer}
                  autoCapitalize="none"
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { borderColor: colors.border }]}
                    onPress={() => setClaimModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.textMuted }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <GlowButton
                    title="Submit"
                    onPress={handleClaim}
                    loading={loading}
                    style={styles.submitButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: spacing.md
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 2,
    marginBottom: spacing.lg
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20
  },
  matchCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
    overflow: 'hidden'
  },
  matchBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    zIndex: 1
  },
  matchPercent: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: 200
  },
  details: {
    padding: spacing.lg
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.md
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  infoLabel: {
    fontSize: 14,
    width: 80
  },
  infoValue: {
    fontSize: 14,
    flex: 1
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm
  },
  securityBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginTop: spacing.md,
    marginBottom: spacing.md
  },
  securityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.sm
  },
  securityQuestion: {
    fontSize: 16,
    lineHeight: 22
  },
  claimButton: {
    marginTop: spacing.md
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.lg,
    padding: spacing.xl
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  modalQuestion: {
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
    lineHeight: 22
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center'
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  submitButton: {
    flex: 1
  }
});

export default MatchesScreen;
