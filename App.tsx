import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme, DarkColors, LightColors } from './context/ThemeContext';

// Import all screens
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ServersScreen from './screens/ServersScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SettingsScreen from './screens/SettingsScreen';

function MainApp() {
  const [activeTab, setActiveTab] = useState('Profile');
  const insets = useSafeAreaInsets();
  const { theme, colors } = useTheme();

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenContainer: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: colors.tabBar || (theme === 'dark' ? '#0a0a0a' : '#FFFFFF'),
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: insets.bottom,
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
      color: colors.textSecondary,
    },
    tabLabelActive: {
      color: colors.gold,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>
      
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Profile')}>
          <Ionicons 
            name={activeTab === 'Profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={activeTab === 'Profile' ? colors.gold : colors.textSecondary} 
          />
          <Text style={[styles.tabLabel, activeTab === 'Profile' && styles.tabLabelActive]}>
            Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Chat')}>
          <Ionicons 
            name={activeTab === 'Chat' ? 'chatbubble' : 'chatbubble-outline'} 
            size={24} 
            color={activeTab === 'Chat' ? colors.gold : colors.textSecondary} 
          />
          <Text style={[styles.tabLabel, activeTab === 'Chat' && styles.tabLabelActive]}>
            Chat
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Servers')}>
          <Ionicons 
            name={activeTab === 'Servers' ? 'server' : 'server-outline'} 
            size={24} 
            color={activeTab === 'Servers' ? colors.gold : colors.textSecondary} 
          />
          <Text style={[styles.tabLabel, activeTab === 'Servers' && styles.tabLabelActive]}>
            Servers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Notifications')}>
          <Ionicons 
            name={activeTab === 'Notifications' ? 'notifications' : 'notifications-outline'} 
            size={24} 
            color={activeTab === 'Notifications' ? colors.gold : colors.textSecondary} 
          />
          <Text style={[styles.tabLabel, activeTab === 'Notifications' && styles.tabLabelActive]}>
            Alerts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('Settings')}>
          <Ionicons 
            name={activeTab === 'Settings' ? 'settings' : 'settings-outline'} 
            size={24} 
            color={activeTab === 'Settings' ? colors.gold : colors.textSecondary} 
          />
          <Text style={[styles.tabLabel, activeTab === 'Settings' && styles.tabLabelActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}