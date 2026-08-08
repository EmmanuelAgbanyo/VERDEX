import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, BarChart2, BookOpen, Briefcase } from 'lucide-react-native';
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
          bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 20,
          right: 20,
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: 'rgba(210, 222, 205, 0.6)',
          borderRadius: 32,
          height: 64,
          paddingBottom: 6,
          paddingTop: 6,
          shadowColor: '#072017',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          elevation: 10,
          zIndex: 1000,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: '#0B3C2F',
        tabBarInactiveTintColor: '#6B8276',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Home size={20} color={focused ? '#0B3C2F' : '#6B8276'} strokeWidth={focused ? 2.4 : 2.0} />
            </View>
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="markets"
        options={{
          title: 'Markets',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <BarChart2 size={20} color={focused ? '#0B3C2F' : '#6B8276'} strokeWidth={focused ? 2.4 : 2.0} />
            </View>
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <BookOpen size={20} color={focused ? '#0B3C2F' : '#6B8276'} strokeWidth={focused ? 2.4 : 2.0} />
            </View>
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Briefcase size={20} color={focused ? '#0B3C2F' : '#6B8276'} strokeWidth={focused ? 2.4 : 2.0} />
            </View>
          ),
        }}
        listeners={{ tabPress: triggerHaptic }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(11, 60, 47, 0.10)',
  },
});
