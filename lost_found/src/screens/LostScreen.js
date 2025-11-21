import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { spacing } from '../theme/theme';

const LostScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { token } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching lost posts...');
      const response = await api.get('/posts?type=lost');
      console.log('Lost posts response:', response.data);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching lost posts:', error);
      console.error('Error details:', error.response?.data);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handlePostPress = (post) => {
    navigation.navigate('PostDetail', { post });
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.darkBg }]}>
        <ActivityIndicator size="large" color={colors.neonBlue} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCard post={item} onPress={() => handlePostPress(item)} />
        )}
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
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              No lost items posted yet
            </Text>
          </View>
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
  list: {
    padding: spacing.md
  },
  empty: {
    padding: spacing.xl,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16
  }
});

export default LostScreen;
