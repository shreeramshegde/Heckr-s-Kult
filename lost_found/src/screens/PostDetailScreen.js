import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/GlowButton';
import Input from '../components/Input';
import api from '../services/api';
import { spacing, borderRadius } from '../theme/theme';

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [checkingAttempts, setCheckingAttempts] = useState(false);
  const [contactDetails, setContactDetails] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleClaimPress = async () => {
    setCheckingAttempts(true);
    try {
      // Check how many attempts left before showing modal
      const response = await api.get(`/posts/${post._id}/claim-attempts`);
      const { attemptsLeft: remaining, canAttempt } = response.data;
      
      setAttemptsLeft(remaining);
      
      if (!canAttempt) {
        Alert.alert(
          '❌ Maximum Attempts Reached',
          'You have already used all 3 attempts to answer the security question for this item.',
          [{ text: 'OK' }]
        );
      } else {
        setClaimModalVisible(true);
      }
    } catch (error) {
      console.error('Error checking attempts:', error);
      // If error, still allow them to try (backend will handle it)
      setClaimModalVisible(true);
    } finally {
      setCheckingAttempts(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClaim = async () => {
    if (!securityAnswer.trim()) {
      Alert.alert('Error', 'Please provide an answer');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting to claim post:', post._id);
      console.log('Answer:', securityAnswer);
      
      // Use foundId for claiming found items (when lost user claims)
      const response = await api.post(`/posts/${post._id}/claim`, {
        answer: securityAnswer
      });
      
      console.log('Claim response:', response.data);
      
      if (response.data.success) {
        const contact = response.data.foundOwnerContact;
        console.log('Success! Contact details:', contact);
        console.log('Name:', contact?.name);
        console.log('Email:', contact?.email);
        console.log('Phone:', contact?.phone);
        console.log('Full response.data:', JSON.stringify(response.data, null, 2));
        
        // Close claim modal
        setClaimModalVisible(false);
        setSecurityAnswer('');
        
        // Set contact details and show modal with slight delay to ensure state updates
        setContactDetails(contact);
        setTimeout(() => {
          setShowContactModal(true);
        }, 100);
      } else {
        const attemptsRemaining = response.data.attemptsLeft;
        setAttemptsLeft(attemptsRemaining);
        
        if (attemptsRemaining === 0) {
          Alert.alert(
            '❌ Maximum Attempts Reached',
            'You have used all 3 attempts. You cannot try again.',
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
      console.error('Error response:', error.response?.data);
      
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
        Alert.alert('Error', error.response?.data?.error || error.response?.data?.details || 'Failed to claim');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/posts/${post._id}`);
              Alert.alert('Success', 'Post deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete post');
            }
          }
        }
      ]
    );
  };

  const isOwner = user?.id === post.owner?._id || user?.id === post.owner?.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {(post.image || post.thumbnail) && (() => {
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
        
        <View style={[styles.card, { backgroundColor: colors.darkBgSecondary, borderColor: colors.border }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{post.title}</Text>
            <View style={[
              styles.typeBadge,
              { backgroundColor: post.type === 'lost' ? colors.neonBlueDim : colors.neonBlueGlow }
            ]}>
              <Text style={[styles.typeText, { color: colors.neonBlue }]}>
                {post.type.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {post.description}
          </Text>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Category:</Text>
            <Text style={[styles.detailValue, { color: colors.neonBlue }]}>{post.category}</Text>
          </View>
          
          {post.color && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Color:</Text>
              <View style={styles.colorInfo}>
                <View style={[styles.colorDot, { backgroundColor: post.color.toLowerCase() }]} />
                <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{post.color}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Location:</Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>{post.location}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Date & Time:</Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
              {formatDate(post.dateTime)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Posted by:</Text>
            <Text style={[styles.detailValue, { color: colors.textSecondary }]}>
              {post.owner?.name || 'Unknown'}
            </Text>
          </View>
          
          {post.type === 'found' && !isOwner && (
            <GlowButton
              title="It's Mine! 🎯"
              onPress={handleClaimPress}
              loading={checkingAttempts}
              style={styles.claimButton}
            />
          )}
          
          {isOwner && (
            <GlowButton
              title="Delete Post"
              onPress={handleDelete}
              variant="outline"
              style={styles.deleteButton}
            />
          )}
        </View>
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
            
            <Text style={[styles.attemptsText, { color: colors.textMuted }]}>
              Attempts remaining: {attemptsLeft}/3
            </Text>
            
            <Text style={[styles.modalQuestion, { color: colors.textPrimary }]}>
              {post.securityQuestion}
            </Text>
            
            <Input
              placeholder="Your answer"
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
            />
            
            <GlowButton
              title="Submit"
              onPress={handleClaim}
              loading={loading}
              style={styles.modalButton}
            />
            
            <TouchableOpacity onPress={() => setClaimModalVisible(false)}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Contact Details Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showContactModal}
        onRequestClose={() => {
          setShowContactModal(false);
          navigation.goBack();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.success }]}>
              ✅ Claim Successful!
            </Text>
            
            {contactDetails ? (
              <View style={styles.contactInfo}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  Finder Details:
                </Text>
                
                <View style={styles.contactItem}>
                  <Text style={[styles.contactKey, { color: colors.textMuted }]}>Name:</Text>
                  <Text style={[styles.contactValue, { color: colors.text }]}>{contactDetails.name || 'N/A'}</Text>
                </View>
                
                <View style={styles.contactItem}>
                  <Text style={[styles.contactKey, { color: colors.textMuted }]}>Email:</Text>
                  <Text style={[styles.contactValue, { color: colors.text }]}>{contactDetails.email || 'N/A'}</Text>
                </View>
                
                <View style={styles.contactItem}>
                  <Text style={[styles.contactKey, { color: colors.textMuted }]}>Phone:</Text>
                  <Text style={[styles.contactValue, { color: colors.text }]}>{contactDetails.phone || 'Not provided'}</Text>
                </View>
                
                <Text style={[styles.noteText, { color: colors.textMuted }]}>
                  Both of you have been notified with contact details.
                </Text>
              </View>
            ) : (
              <Text style={[styles.contactLabel, { color: colors.text }]}>
                Loading contact details...
              </Text>
            )}
            
            <GlowButton
              title="OK"
              onPress={() => {
                setShowContactModal(false);
                setContactDetails(null);
                navigation.goBack();
              }}
              style={styles.okButton}
            />
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
    paddingBottom: spacing.xl
  },
  image: {
    width: '100%',
    height: 300
  },
  card: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: spacing.md
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.sm
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    marginVertical: spacing.md
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right'
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
    marginBottom: spacing.md
  },
  securityLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs
  },
  securityQuestion: {
    fontSize: 16
  },
  claimButton: {
    marginTop: spacing.md
  },
  deleteButton: {
    marginTop: spacing.md
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: spacing.xl,
    borderRadius: borderRadius.xl
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center'
  },
  attemptsText: {
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  modalQuestion: {
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center'
  },
  modalButton: {
    marginTop: spacing.md
  },
  cancelText: {
    textAlign: 'center',
    marginTop: spacing.md,
    fontSize: 16
  },
  contactInfo: {
    width: '100%',
    marginVertical: spacing.lg
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#00d4ff'
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 212, 255, 0.3)',
    marginBottom: spacing.xs
  },
  contactKey: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00d4ff'
  },
  contactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  noteText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontStyle: 'italic'
  },
  okButton: {
    marginTop: spacing.md,
    width: '100%'
  }
});

export default PostDetailScreen;
