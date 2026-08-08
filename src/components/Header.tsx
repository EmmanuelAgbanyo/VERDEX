import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';

interface HeaderProps {
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNotificationPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textGroup}>
        <Text style={styles.greetingTitle}>Good morning, Team VERDEX</Text>
        <Text style={styles.subtitleText}>Your daily climate & market snapshot</Text>
      </View>

      <Pressable
        onPress={onNotificationPress}
        style={({ pressed }) => [styles.notificationBtn, pressed && styles.pressedState]}
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        accessibilityHint="View latest notifications"
      >
        <Bell size={18} color="#0D211A" strokeWidth={2.2} />
        <View style={styles.unreadDot} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  textGroup: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D211A',
    letterSpacing: -0.4,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B8276',
    marginTop: 2,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8DE',
    position: 'relative',
    shadowColor: '#0E2E21',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pressedState: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
