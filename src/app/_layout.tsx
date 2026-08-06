import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.bgDark },
          headerTintColor: COLORS.textBright,
          contentStyle: { backgroundColor: COLORS.bgDark },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="asset/[id]"
          options={{
            headerTitle: 'Asset Diagnostic',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: COLORS.bgDarkAlt },
          }}
        />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerTitle: 'Learning Module',
            headerBackTitle: 'Lab',
            headerStyle: { backgroundColor: COLORS.bgDarkAlt },
          }}
        />
      </Stack>
    </AppProvider>
  );
}
