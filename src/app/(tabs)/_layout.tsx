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
          bottom: 14,
          left: 14,
          right: 14,
          backgroundColor: '#FFFFFF',
          borderWidth: 1.5,
          borderColor: '#C5D8B8',
          borderRadius: 24,
          height: 68,
          paddingBottom: 6,
          paddingTop: 6,
          shadowColor: '#072017',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
          zIndex: 1000,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: '#0D5C46',
        tabBarInactiveTintColor: '#374151',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.2,
          marginTop: 2,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: 'Markets',
          tabBarIcon: ({ color, focused }) => (
            <BarChart2 size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={focused ? 22 : 20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
    </Tabs>
  );
}
