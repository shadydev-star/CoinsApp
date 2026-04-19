import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import all screens
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ServersScreen from './screens/ServersScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Colors = {
  background: '#000000',
  gold: '#FFD700',
  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Profile');

  const renderScreen = () => {
    switch(activeTab) {
      case 'Profile': return <ProfileScreen />;
      case 'Chat': return <ChatScreen />;
      case 'Servers': return <ServersScreen />;
      case 'Notifications': return <NotificationsScreen />;
      case 'Settings': return <SettingsScreen />;
      default: return <ProfileScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Profile')}>
          <Ionicons name={activeTab === 'Profile' ? 'person' : 'person-outline'} size={24} color={activeTab === 'Profile' ? Colors.gold : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'Profile' ? Colors.gold : Colors.textSecondary }]}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Chat')}>
          <Ionicons name={activeTab === 'Chat' ? 'chatbubble' : 'chatbubble-outline'} size={24} color={activeTab === 'Chat' ? Colors.gold : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'Chat' ? Colors.gold : Colors.textSecondary }]}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Servers')}>
          <Ionicons name={activeTab === 'Servers' ? 'server' : 'server-outline'} size={24} color={activeTab === 'Servers' ? Colors.gold : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'Servers' ? Colors.gold : Colors.textSecondary }]}>Servers</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Notifications')}>
          <Ionicons name={activeTab === 'Notifications' ? 'notifications' : 'notifications-outline'} size={24} color={activeTab === 'Notifications' ? Colors.gold : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'Notifications' ? Colors.gold : Colors.textSecondary }]}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Settings')}>
          <Ionicons name={activeTab === 'Settings' ? 'settings' : 'settings-outline'} size={24} color={activeTab === 'Settings' ? Colors.gold : Colors.textSecondary} />
          <Text style={[styles.tabLabel, { color: activeTab === 'Settings' ? Colors.gold : Colors.textSecondary }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});