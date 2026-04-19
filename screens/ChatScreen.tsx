import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatStyles as styles } from '../styles/chatStyles';
import { Colors } from '../styles/colors';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      <View style={styles.centerContainer}>
        <Ionicons name="chatbubbles-outline" size={64} color={Colors.gold} />
        <Text style={styles.centerText}>Messages</Text>
        <Text style={styles.centerSubtext}>1-on-1 and group chat for game negotiation</Text>
      </View>
    </View>
  );
}