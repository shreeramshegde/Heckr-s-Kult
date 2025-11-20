import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { getFoundItems, deleteItem } from '../utils/storage';

const FoundScreen = ({ user }) => {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async () => {
    const foundItems = await getFoundItems();
    // Sort by most recent first
    setItems(foundItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteItem(itemId, 'found');
            if (result.success) {
              loadItems();
            } else {
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>FOUND</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Found At: </Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactLabel}>Contact: </Text>
        <Text style={styles.contact}>{item.userEmail}</Text>
      </View>

      {user.email === item.userEmail && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Found Items</Text>
        <Text style={styles.headerSubtitle}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No found items reported</Text>
          <Text style={styles.emptySubtext}>
            Pull down to refresh or post a new item
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#27ae60',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 5,
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#95a5a6',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  location: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  contactContainer: {
    flexDirection: 'row',
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  contact: {
    fontSize: 14,
    color: '#3498db',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#95a5a6',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
});

export default FoundScreen;
