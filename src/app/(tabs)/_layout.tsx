import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
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
          bottom: 12,
          left: 12,
          right: 12,
          backgroundColor: '#FFFFFF',
          borderWidth: 1.5,
          borderColor: '#B0C9A0',
          borderRadius: 24,
          height: 66,
          paddingBottom: 4,
          paddingTop: 4,
          shadowColor: '#072017',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.16,
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
        tabBarInactiveTintColor: '#1E293B',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '900',
          letterSpacing: 0.2,
          marginTop: 1,
          marginBottom: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <LayoutGrid size={focused ? 20 : 19} color={focused ? '#0D5C46' : '#1E293B'} strokeWidth={focused ? 2.6 : 2.2} />
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
              <BarChart2 size={focused ? 20 : 19} color={focused ? '#0D5C46' : '#1E293B'} strokeWidth={focused ? 2.6 : 2.2} />
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
              <BookOpen size={focused ? 20 : 19} color={focused ? '#0D5C46' : '#1E293B'} strokeWidth={focused ? 2.6 : 2.2} />
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
              <Briefcase size={focused ? 20 : 19} color={focused ? '#0D5C46' : '#1E293B'} strokeWidth={focused ? 2.6 : 2.2} />
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
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(13, 92, 70, 0.12)',
  },
});
