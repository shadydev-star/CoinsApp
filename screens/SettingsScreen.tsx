import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { settingsStyles as styles } from '../styles/settingsStyles';
import { Colors } from '../styles/colors';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.centerContainer}>
        <Ionicons name="settings-outline" size={64} color={Colors.gold} />
        <Text style={styles.centerText}>Preferences</Text>
        <Text style={styles.centerSubtext}>App settings and security</Text>
      </View>
    </View>
  );
}