import React from 'react';
import { Tabs } from 'expo-router';
import { COLORS } from '@/constants/theme';
import { LayoutGrid, BarChart2, BookOpen, Briefcase } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function TabLayout() {
  const triggerHaptic = () => {
    try {
      Haptics.selectionAsync();
    } catch (e) {}
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#FFFFFF',
          borderWidth: 1.5,
          borderColor: '#D2DEC9',
          borderTopWidth: 1.5,
          borderTopColor: '#D2DEC9',
          borderRadius: 26,
          height: 72,
          paddingBottom: 10,
          paddingTop: 10,
          shadowColor: '#072017',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.16,
          shadowRadius: 24,
          elevation: 10,
        },
        tabBarActiveTintColor: '#0D5C46',
        tabBarInactiveTintColor: '#2C4035',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.2,
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: 'Markets',
          tabBarIcon: ({ color, focused }) => (
            <BarChart2 size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={focused ? 24 : 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
    </Tabs>
  );
}
