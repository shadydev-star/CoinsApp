import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationsStyles as styles } from '../styles/notificationsStyles';
import { Colors } from '../styles/colors';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <View style={styles.centerContainer}>
        <Ionicons name="notifications-outline" size={64} color={Colors.gold} />
        <Text style={styles.centerText}>Alerts</Text>
        <Text style={styles.centerSubtext}>Match invites and player challenges</Text>
      </View>
    </View>
  );
}