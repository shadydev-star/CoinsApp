import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { serversStyles as styles } from '../styles/serversStyles';
import { Colors } from '../styles/colors';

export default function ServersScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servers</Text>
      </View>
      <View style={styles.centerContainer}>
        <Ionicons name="server-outline" size={64} color={Colors.gold} />
        <Text style={styles.centerText}>Game Servers</Text>
        <Text style={styles.centerSubtext}>Join public or private servers</Text>
      </View>
    </View>
  );
}