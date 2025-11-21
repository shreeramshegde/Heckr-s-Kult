import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, borderRadius, shadows } from '../theme/theme';

const PostCard = ({ post, onPress }) => {
  const { colors } = useTheme();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.borderSecondary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {post.thumbnail || post.image ? (
        <Image
          source={{ uri: `http://localhost:5000/${post.thumbnail || post.image}` }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.inputBg }]}>
          <Text style={[styles.placeholderText, { color: colors.textMuted }]}>No Image</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {post.title}
          </Text>
          <View style={[
            styles.typeBadge,
            { backgroundColor: post.type === 'lost' ? colors.neonBlueDim : colors.neonBlueGlow }
          ]}>
            <Text style={[styles.typeText, { color: colors.neonBlue }]}>
              {post.type.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {post.description}
        </Text>
        
        <View style={styles.details}>
          <Text style={[styles.detailText, { color: colors.textMuted }]}>
            📍 {post.location}
          </Text>
          <Text style={[styles.detailText, { color: colors.textMuted }]}>
            📅 {formatDate(post.dateTime)}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={[styles.categoryBadge, { borderColor: colors.borderSecondary }]}>
            <Text style={[styles.categoryText, { color: colors.neonBlue }]}>{post.category}</Text>
          </View>
          {post.color && (
            <View style={styles.colorInfo}>
              <View style={[styles.colorDot, { backgroundColor: post.color.toLowerCase() }]} />
              <Text style={[styles.colorText, { color: colors.textMuted }]}>{post.color}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.card
  },
  image: {
    width: '100%',
    height: 180
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    fontSize: 14
  },
  content: {
    padding: spacing.md
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: spacing.sm
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm
  },
  typeText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  description: {
    fontSize: 14,
    marginBottom: spacing.sm,
    lineHeight: 20
  },
  details: {
    marginBottom: spacing.sm
  },
  detailText: {
    fontSize: 12,
    marginBottom: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryBadge: {
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600'
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6
  },
  colorText: {
    fontSize: 12
  }
});

export default PostCard;
