import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/theme';

const FeedbackFormScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [formData, setFormData] = useState({
    rating: 0,
    experience: '',
    tmfcid: 'TMFC005HC', // Default to your team code
    comments: ''
  });
  const [showTMFCPicker, setShowTMFCPicker] = useState(false);

  const validTMFCIds = [
    'TMFC005HC', // Your team (default)
    'TMFC001TC', 'TMFC002ES', 'TMFC003RN', 'TMFC004EC'
  ];
  const [loading, setLoading] = useState(false);

  const experienceOptions = [
    { value: 'good', label: 'Very Satisfied', emoji: '😊' },
    { value: 'satisfied', label: 'Satisfied', emoji: '🙂' },
    { value: 'needs_improvement', label: 'Needs Improvement', emoji: '�' }
  ];

  const handleRatingPress = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleExperienceSelect = (experience) => {
    setFormData(prev => ({ ...prev, experience }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      Alert.alert('Validation Error', 'Please select a rating between 1 and 5');
      return false;
    }
    
    if (!formData.experience) {
      Alert.alert('Validation Error', 'Please select your experience level');
      return false;
    }
    
    if (!formData.tmfcid.trim()) {
      Alert.alert('Validation Error', 'Please enter your TMFC ID');
      return false;
    }
    
    return true;
  };

  const submitFeedback = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      console.log('Submitting feedback:', formData);
      
      const response = await fetch('https://telemetry-api-iota.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: formData.rating,
          experience: formData.experience,
          tmfcid: formData.tmfcid.trim(),
          comments: formData.comments.trim()
        }),
      });
      
      const result = await response.json();
      console.log('Feedback response:', result);
      
      if (response.ok) {
        Alert.alert(
          'Success!', 
          'Thank you for your feedback. It has been submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  rating: 0,
                  experience: '',
                  tmfcid: 'TMFC005HC', // Reset to your team code
                  comments: ''
                });
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error(result.message || 'Failed to submit feedback');
      }
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert(
        'Error',
        `Failed to submit feedback: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = () => (
    <View style={styles.ratingContainer}>
      <Text style={[styles.label, { color: colors.text }]}>
        Rating *
      </Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRatingPress(star)}
            style={styles.starButton}
          >
            <Ionicons
              name={star <= formData.rating ? 'star' : 'star-outline'}
              size={32}
              color={star <= formData.rating ? '#FFD700' : colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.ratingText, { color: colors.textMuted }]}>
        {formData.rating > 0 && `${formData.rating} out of 5 stars`}
      </Text>
    </View>
  );

  const renderExperienceOptions = () => (
    <View style={styles.experienceContainer}>
      <Text style={[styles.label, { color: colors.text }]}>
        Experience *
      </Text>
      {experienceOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.experienceOption,
            {
              backgroundColor: formData.experience === option.value ? colors.neonBlue : colors.cardBg,
              borderColor: formData.experience === option.value ? colors.neonBlue : colors.borderSecondary
            }
          ]}
          onPress={() => handleExperienceSelect(option.value)}
        >
          <Text style={styles.emoji}>{option.emoji}</Text>
          <Text
            style={[
              styles.experienceText,
              {
                color: formData.experience === option.value ? colors.darkBg : colors.text
              }
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.darkBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="chatbubble-ellipses" size={48} color={colors.neonBlue} />
          <Text style={[styles.title, { color: colors.text }]}>
            Share Your Feedback
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Help us improve our service
          </Text>
        </View>

        <View style={styles.form}>
          {renderRatingStars()}

          {renderExperienceOptions()}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              TMFC ID *
            </Text>
            <TouchableOpacity
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.borderSecondary,
                  justifyContent: 'center'
                }
              ]}
              onPress={() => setShowTMFCPicker(!showTMFCPicker)}
            >
              <Text style={[
                { color: formData.tmfcid ? colors.text : colors.textMuted }
              ]}>
                {formData.tmfcid || 'Select your TMFC ID'}
              </Text>
              <Ionicons 
                name={showTMFCPicker ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.textMuted}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
            {showTMFCPicker && (
              <View style={[styles.pickerContainer, { backgroundColor: colors.cardBg, borderColor: colors.borderSecondary }]}>
                {validTMFCIds.map((id) => (
                  <TouchableOpacity
                    key={id}
                    style={styles.pickerItem}
                    onPress={() => {
                      handleInputChange('tmfcid', id);
                      setShowTMFCPicker(false);
                    }}
                  >
                    <Text style={[styles.pickerText, { color: colors.text }]}>
                      {id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Comments (Optional)
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.borderSecondary
                }
              ]}
              placeholder="Share additional comments or suggestions..."
              placeholderTextColor={colors.textMuted}
              value={formData.comments}
              onChangeText={(value) => handleInputChange('comments', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.neonBlue,
                opacity: loading ? 0.7 : 1
              }
            ]}
            onPress={submitFeedback}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.darkBg} />
            ) : (
              <>
                <Ionicons name="send" size={20} color={colors.darkBg} />
                <Text style={[styles.submitButtonText, { color: colors.darkBg }]}>
                  Submit Feedback
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: spacing.lg
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center'
  },
  form: {
    gap: spacing.lg
  },
  ratingContainer: {
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    alignSelf: 'flex-start'
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  starButton: {
    padding: spacing.xs
  },
  ratingText: {
    fontSize: 14
  },
  experienceContainer: {
    gap: spacing.sm
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1
  },
  emoji: {
    fontSize: 24,
    marginRight: spacing.md
  },
  experienceText: {
    fontSize: 16,
    fontWeight: '500'
  },
  inputContainer: {
    gap: spacing.sm
  },
  textInput: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownIcon: {
    position: 'absolute',
    right: spacing.md
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: spacing.xs,
    overflow: 'hidden'
  },
  pickerItem: {
    padding: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.1)'
  },
  pickerText: {
    fontSize: 16
  },
  textArea: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    height: 100
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginTop: spacing.md,
    gap: spacing.sm
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default FeedbackFormScreen;