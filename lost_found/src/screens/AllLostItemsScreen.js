import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { spacing } from '../theme/theme';

const AllLostItemsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { token } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Electronics', 'Books', 'Accessories', 'Clothing', 'ID Cards', 'Keys', 'Other'];

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, selectedCategory]);

  const fetchPosts = async () => {
    try {
      console.log('Fetching all lost posts...');
      const response = await api.get('/posts?type=lost');
      console.log('All lost posts response:', response.data);
      
      const postsData = response.data.posts || [];
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching lost posts:', error);
      console.error('Error details:', error.response?.data);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.location.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        (post.color && post.color.toLowerCase().includes(query))
      );
    }
    
    setFilteredPosts(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handlePostPress = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryChip,
            { 
              backgroundColor: selectedCategory === category ? colors.neonBlue : colors.cardBg,
              borderColor: selectedCategory === category ? colors.neonBlue : colors.borderSecondary
            }
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text 
            style={[
              styles.categoryText,
              { color: selectedCategory === category ? colors.darkBg : colors.text }
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: colors.text }]}>
        All Lost Items ({filteredPosts.length})
      </Text>
      
      <View style={[
        styles.searchContainer, 
        { 
          backgroundColor: colors.inputBg,
          borderColor: colors.borderSecondary,
          borderWidth: 1
        }
      ]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search lost items..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      
      {renderCategoryFilter()}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.darkBg }]}>
        <ActivityIndicator size="large" color={colors.neonBlue} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Loading lost items...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={() => handlePostPress(item)} />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.neonBlue}
            colors={[colors.neonBlue]}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No lost items found
              </Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filter'
                  : 'No lost items have been reported yet'
                }
              </Text>
              {(searchQuery || selectedCategory !== 'All') && (
                <TouchableOpacity 
                  style={[styles.clearFiltersButton, { backgroundColor: colors.neonBlue }]}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  <Text style={[styles.clearFiltersText, { color: colors.darkBg }]}>
                    Clear Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 14
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg
  },
  headerContainer: {
    paddingVertical: spacing.md
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    marginBottom: spacing.md
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16
  },
  categoryContainer: {
    paddingHorizontal: spacing.xs
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    borderRadius: 20,
    borderWidth: 1
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600'
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.sm
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg
  },
  clearFiltersButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    alignSelf: 'center'
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600'
  }
});

export default AllLostItemsScreen;