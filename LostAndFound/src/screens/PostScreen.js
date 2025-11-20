import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { saveLostItem, saveFoundItem } from '../utils/storage';

const PostScreen = ({ user, navigation }) => {
  const [itemType, setItemType] = useState('lost'); // 'lost' or 'found'
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!itemName || !description || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    const itemData = {
      itemName: itemName.trim(),
      description: description.trim(),
      location: location.trim(),
      userEmail: user.email,
      userName: user.name,
    };

    const result = itemType === 'lost'
      ? await saveLostItem(itemData)
      : await saveFoundItem(itemData);

    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        `Item posted successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setItemName('');
              setDescription('');
              setLocation('');
              // Navigate to the appropriate tab
              navigation.navigate(itemType === 'lost' ? 'Lost' : 'Found');
            },
          },
        ]
      );
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post an Item</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>Item Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                itemType === 'lost' && styles.typeButtonActive,
              ]}
              onPress={() => setItemType('lost')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  itemType === 'lost' && styles.typeButtonTextActive,
                ]}
              >
                Lost
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                itemType === 'found' && styles.typeButtonActive,
              ]}
              onPress={() => setItemType('found')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  itemType === 'found' && styles.typeButtonTextActive,
                ]}
              >
                Found
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Blue Backpack, Phone, Keys"
            value={itemName}
            onChangeText={setItemName}
            editable={!loading}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide detailed description..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            editable={!loading}
          />

          <Text style={styles.label}>
            {itemType === 'lost' ? 'Last Seen Location' : 'Found Location'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Library, Canteen, Parking Lot"
            value={location}
            onChangeText={setLocation}
            editable={!loading}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              itemType === 'lost' ? styles.submitButtonLost : styles.submitButtonFound,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Posting...' : 'Post Item'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#9b59b6',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 15,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#9b59b6',
    backgroundColor: '#9b59b6',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  submitButtonLost: {
    backgroundColor: '#e74c3c',
  },
  submitButtonFound: {
    backgroundColor: '#27ae60',
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostScreen;
