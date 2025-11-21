import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main Screens
import LostScreen from '../screens/LostScreen';
import FoundScreen from '../screens/FoundScreen';
import AllLostItemsScreen from '../screens/AllLostItemsScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import UserScreen from '../screens/UserScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import MatchesScreen from '../screens/MatchesScreen';
import FeedbackFormScreen from '../screens/FeedbackFormScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
export const AuthNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkBg
        },
        headerTintColor: colors.neonBlue,
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
};

// Lost Stack
const LostStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkBg
        },
        headerTintColor: colors.neonBlue,
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen 
        name="LostList" 
        component={AllLostItemsScreen}
        options={{ title: 'Lost Items' }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{ title: 'Item Details' }}
      />
    </Stack.Navigator>
  );
};

// Found Stack
const FoundStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkBg
        },
        headerTintColor: colors.neonBlue,
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen 
        name="FoundList" 
        component={FoundScreen}
        options={{ title: 'Found Items' }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{ title: 'Item Details' }}
      />
    </Stack.Navigator>
  );
};

// Post Stack
const PostStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkBg
        },
        headerTintColor: colors.neonBlue,
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen}
        options={{ title: 'Report Item' }}
      />
      <Stack.Screen 
        name="Matches" 
        component={MatchesScreen}
        options={{ title: 'Matching Items Found' }}
      />
    </Stack.Navigator>
  );
};

// User Stack
const UserStack = () => {
  const { colors } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkBg
        },
        headerTintColor: colors.neonBlue,
        headerTitleStyle: {
          fontWeight: 'bold'
        }
      }}
    >
      <Stack.Screen 
        name="UserProfile" 
        component={UserScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen}
        options={{ title: 'Item Details' }}
      />
      <Stack.Screen 
        name="FeedbackForm" 
        component={FeedbackFormScreen}
        options={{ title: 'Feedback' }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
export const MainNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Lost') {
            iconName = focused ? 'alert-circle' : 'alert-circle-outline';
          } else if (route.name === 'Found') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00d4ff',
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.darkBg,
          borderTopColor: 'rgba(0, 212, 255, 0.3)',
          borderTopWidth: 2,
          height: 60,
          paddingBottom: 8,
          elevation: 0,
          shadowOpacity: 0
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Lost" component={LostStack} />
      <Tab.Screen name="Found" component={FoundStack} />
      <Tab.Screen name="Post" component={PostStack} />
      <Tab.Screen name="User" component={UserStack} />
    </Tab.Navigator>
  );
};
