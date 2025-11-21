import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import GlowButton from '../components/GlowButton';
import Input from '../components/Input';
import api from '../services/api';
import { spacing, borderRadius } from '../theme/theme';

const CATEGORIES = ['Electronics', 'Books', 'Accessories', 'Clothing', 'ID Cards', 'Keys', 'Other'];

const CreatePostScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().split('T')[0]);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    
    if (type === 'found') {
      if (!securityQuestion.trim()) newErrors.securityQuestion = 'Security question is required for found items';
      if (!securityAnswer.trim()) newErrors.securityAnswer = 'Security answer is required for found items';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('color', color);
      formData.append('location', location);
      formData.append('dateTime', new Date(dateTime).toISOString());
      
      if (type === 'found') {
        formData.append('securityQuestion', securityQuestion);
        formData.append('securityAnswer', securityAnswer);
      }
      
      if (image) {
        const imageUri = Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri;
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'post-image.jpg'
        });
      }
      
      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Check if there are matches for lost posts
      if (type === 'lost' && response.data.matches && response.data.matches.length > 0) {
        const matches = response.data.matches;
        
        // Navigate to matches screen to show all matching items
        navigation.navigate('Matches', { matches });
      } else {
        Alert.alert('Success', `${type === 'lost' ? 'Lost' : 'Found'} item posted successfully!`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'lost' && { backgroundColor: colors.neonBlue },
              { borderColor: colors.neonBlue }
            ]}
            onPress={() => setType('lost')}
          >
            <Text style={[
              styles.typeButtonText,
              { color: type === 'lost' ? colors.darkBg : colors.neonBlue }
            ]}>
              LOST
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'found' && { backgroundColor: colors.neonBlue },
              { borderColor: colors.neonBlue }
            ]}
            onPress={() => setType('found')}
          >
            <Text style={[
              styles.typeButtonText,
              { color: type === 'found' ? colors.darkBg : colors.neonBlue }
            ]}>
              FOUND
            </Text>
          </TouchableOpacity>
        </View>
        
        <Input
          label="Title"
          placeholder="e.g., Black iPhone 13"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />
        
        <Input
          label="Description"
          placeholder="Detailed description..."
          value={description}
          onChangeText={setDescription}
          error={errors.description}
          multiline
          numberOfLines={4}
          style={{ height: 100 }}
        />
        
        {/* Category Selection */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && { backgroundColor: colors.neonBlue },
                { borderColor: colors.border }
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                { color: category === cat ? colors.darkBg : colors.textSecondary }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.category && <Text style={[styles.error, { color: colors.error }]}>{errors.category}</Text>}
        
        <Input
          label="Color (Optional)"
          placeholder="e.g., Black, Blue"
          value={color}
          onChangeText={setColor}
        />
        
        <Input
          label="Location"
          placeholder="Where was it lost/found?"
          value={location}
          onChangeText={setLocation}
          error={errors.location}
        />
        
        <Input
          label="Date"
          placeholder="YYYY-MM-DD"
          value={dateTime}
          onChangeText={setDateTime}
        />
        
        {type === 'found' && (
          <>
            <Text style={[styles.infoText, { color: colors.textMuted, marginBottom: spacing.sm }]}>
              💡 Ask a security question to verify the lost item owner
            </Text>
            <Input
              label="Security Question"
              placeholder="e.g., What's the phone wallpaper?"
              value={securityQuestion}
              onChangeText={setSecurityQuestion}
              error={errors.securityQuestion}
            />
            
            <Input
              label="Security Answer"
              placeholder="Answer that the owner should know"
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
              error={errors.securityAnswer}
              secureTextEntry
            />
          </>
        )}
        
        {/* Image Picker */}
        <TouchableOpacity
          style={[styles.imagePicker, { borderColor: colors.border }]}
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
          ) : (
            <Text style={[styles.imagePickerText, { color: colors.textMuted }]}>
              📷 Add Photo (Optional)
            </Text>
          )}
        </TouchableOpacity>
        
        <GlowButton
          title={`Post ${type === 'lost' ? 'Lost' : 'Found'} Item`}
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    alignItems: 'center'
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  categoryButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1
  },
  categoryText: {
    fontSize: 14
  },
  imagePicker: {
    height: 200,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden'
  },
  imagePickerText: {
    fontSize: 16
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  submitButton: {
    marginBottom: spacing.xl
  },
  error: {
    fontSize: 12,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm
  },
  infoText: {
    fontSize: 13,
    fontStyle: 'italic'
  }
});

export default CreatePostScreen;
