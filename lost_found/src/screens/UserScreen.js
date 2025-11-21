import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/GlowButton';
import PostCard from '../components/PostCard';
import api from '../services/api';
import { spacing, borderRadius } from '../theme/theme';

const UserScreen = ({ navigation }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const response = await api.get('/posts/my-posts');
      setMyPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  };

  const handleLogout = async () => {
    console.log('Logout button pressed - calling logout directly');
    await logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.darkBg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.borderSecondary }]}>
          <View style={[styles.avatar, { backgroundColor: colors.neonBlue }]}>
            <Text style={[styles.avatarText, { color: colors.darkBg }]}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
          {user?.phone && (
            <Text style={[styles.phone, { color: colors.textMuted }]}>📱 {user.phone}</Text>
          )}
        </View>
        
        {/* Settings Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBg, borderColor: colors.borderSecondary }]}>
          <Text style={[styles.sectionTitle, { color: colors.neonBlue }]}>Settings</Text>
          
          <View style={[styles.settingRow, { borderColor: colors.borderSecondary }]}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.textMuted, true: colors.neonBlue }}
              thumbColor={colors.text}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.settingRow, { borderColor: colors.borderSecondary }]}
            onPress={() => navigation.navigate('FeedbackForm')}
          >
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              📝 Give Feedback
            </Text>
            <Text style={[styles.settingValue, { color: colors.textMuted }]}>
              Share your experience
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* My Posts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.neonBlue }]}>
            My Posts ({myPosts.length})
          </Text>
          
          {myPosts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              You haven't posted anything yet
            </Text>
          ) : (
            myPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPress={() => navigation.navigate('PostDetail', { post })}
              />
            ))
          )}
        </View>
        
        {/* Logout Button */}
        <GlowButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
        
        {/* App Info */}
        <Text style={[styles.appInfo, { color: colors.textMuted }]}>
          Lost & Found v1.0.0{'\n'}
          NIE College Community
        </Text>
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
  profileCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs
  },
  email: {
    fontSize: 16,
    marginBottom: spacing.xs
  },
  phone: {
    fontSize: 14
  },
  section: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600'
  },
  settingValue: {
    fontSize: 14
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: spacing.lg
  },
  logoutButton: {
    marginVertical: spacing.xl
  },
  appInfo: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: spacing.xl
  }
});

export default UserScreen;
