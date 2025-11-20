import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import LostScreen from '../screens/LostScreen';
import FoundScreen from '../screens/FoundScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon, label }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ fontSize: 24, marginBottom: 2 }}>{icon}</Text>
    <Text
      style={{
        fontSize: 10,
        color: focused ? '#3498db' : '#95a5a6',
        fontWeight: focused ? 'bold' : 'normal',
      }}
    >
      {label}
    </Text>
  </View>
);

const TabNavigator = ({ user, onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Lost"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🔍" label="Lost" />
          ),
        }}
      >
        {(props) => <LostScreen {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Found"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="✅" label="Found" />
          ),
        }}
      >
        {(props) => <FoundScreen {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Post"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="➕" label="Post" />
          ),
        }}
      >
        {(props) => <PostScreen {...props} user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="👤" label="Profile" />
          ),
        }}
      >
        {(props) => <ProfileScreen {...props} user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
