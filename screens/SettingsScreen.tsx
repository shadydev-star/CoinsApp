import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createSettingsStyles } from '../styles/settingsStyles';

export default function SettingsScreen() {
  const { theme, colors, toggleTheme, setTheme } = useTheme();
  const styles = createSettingsStyles(colors);
  
  const [notifications, setNotifications] = useState(true);
  const [faceId, setFaceId] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Mock user data
  const [user] = useState({
    name: 'GameMasterPro',
    email: 'gamemaster@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    balance: 12450,
  });

  // Mock transaction history
  const [transactions] = useState([
    { id: 1, type: 'win', game: 'Call of Duty', opponent: 'ShadowGamer', amount: 500, time: '2 hours ago' },
    { id: 2, type: 'loss', game: 'FIFA 24', opponent: 'ProKicker99', amount: -300, time: '1 day ago' },
    { id: 3, type: 'win', game: 'Fortnite', opponent: 'BuildMaster', amount: 750, time: '2 days ago' },
  ]);

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    isSwitch, 
    value,
    danger 
  }: any) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress} 
      disabled={isSwitch}
    >
      <View style={styles.settingLeft}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={danger ? colors.error : colors.gold} 
          style={styles.settingIcon} 
        />
        <View>
          <Text style={[styles.settingTitle, danger && { color: colors.error }]}>
            {title}
          </Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {isSwitch ? (
        <Switch 
          value={value} 
          onValueChange={onPress} 
          trackColor={{ false: colors.border, true: colors.gold }}
          thumbColor={value ? colors.gold : colors.textTertiary}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const ThemeOption = ({ mode, emoji, label }: { mode: 'light' | 'dark'; emoji: string; label: string }) => (
    <TouchableOpacity 
      style={[styles.themeOption, theme === mode && styles.themeOptionSelected]}
      onPress={() => setTheme(mode)}
    >
      <Text style={styles.themeEmoji}>{emoji}</Text>
      <Text style={styles.themeText}>{label}</Text>
      {theme === mode && (
        <View style={styles.themeCheck}>
          <Ionicons name="checkmark" size={16} color="#000" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <SettingItem 
          icon="person-outline" 
          title="Edit Profile" 
          subtitle="Change your photo, username, or bio"
        />
        <SettingItem 
          icon="image-outline" 
          title="Change Avatar" 
        />
        <SettingItem 
          icon="document-text-outline" 
          title="Bio & Info" 
        />
      </View>

      {/* Wallet Section */}
      <View style={styles.walletCard}>
        <Ionicons name="wallet-outline" size={32} color={colors.gold} />
        <Text style={styles.walletBalance}>{user.balance.toLocaleString()} Coins</Text>
        <Text style={styles.walletLabel}>Total Balance</Text>
        <TouchableOpacity style={{ marginTop: 12 }}>
          <Text style={{ color: colors.gold, fontSize: 14 }}>Add Coins →</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map(transaction => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={styles.transactionIcon}>
                <Ionicons 
                  name={transaction.type === 'win' ? 'trophy-outline' : 'close-circle-outline'} 
                  size={20} 
                  color={transaction.type === 'win' ? colors.success : colors.error} 
                />
              </View>
              <View>
                <Text style={styles.transactionGame}>{transaction.game}</Text>
                <Text style={styles.transactionOpponent}>vs {transaction.opponent}</Text>
                <Text style={styles.transactionTime}>{transaction.time}</Text>
              </View>
            </View>
            <Text 
              style={[
                styles.transactionAmount, 
                { color: transaction.amount > 0 ? colors.success : colors.error }
              ]}
            >
              {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
            </Text>
          </View>
        ))}
        <TouchableOpacity style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: colors.gold }}>View All Transactions →</Text>
        </TouchableOpacity>
      </View>

      {/* Appearance Section - Theme Toggle */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <ThemeOption mode="dark" emoji="🌙" label="Dark Mode" />
        <ThemeOption mode="light" emoji="☀️" label="Light Mode" />
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem 
          icon="notifications-outline" 
          title="Push Notifications" 
          isSwitch 
          value={notifications} 
          onPress={() => setNotifications(!notifications)}
        />
        <SettingItem 
          icon="volume-high-outline" 
          title="Sound Effects" 
          isSwitch 
          value={soundEnabled} 
          onPress={() => setSoundEnabled(!soundEnabled)}
        />
        <SettingItem 
          icon="chatbubble-outline" 
          title="Match Invites" 
        />
        <SettingItem 
          icon="logo-bitcoin" 
          title="Coin Alerts" 
        />
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <SettingItem 
          icon="finger-print-outline" 
          title="Face ID / Fingerprint" 
          isSwitch 
          value={faceId} 
          onPress={() => setFaceId(!faceId)}
          subtitle="Quick and secure login"
        />
        <SettingItem 
          icon="key-outline" 
          title="Change PIN" 
        />
        <SettingItem 
          icon="shield-checkmark-outline" 
          title="Two-Factor Authentication" 
        />
      </View>

      {/* Server Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Server Preferences</Text>
        <SettingItem 
          icon="server-outline" 
          title="Default Region" 
          subtitle="North America - East"
        />
        <SettingItem 
          icon="ban-outline" 
          title="Blocked Players" 
          subtitle="3 players blocked"
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem icon="help-circle-outline" title="Help Center" />
        <SettingItem icon="chatbubble-ellipses-outline" title="Contact Support" />
        <SettingItem icon="document-text-outline" title="Terms & Conditions" />
        <SettingItem icon="lock-closed-outline" title="Privacy Policy" />
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingItem icon="information-circle-outline" title="App Version" subtitle="1.0.0" />
        <SettingItem icon="star-outline" title="Rate Us" />
        <SettingItem icon="share-outline" title="Share App" />
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive', onPress: () => Alert.alert('Logged out') }
            ]
          );
        }}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Coins App v1.0.0</Text>
    </ScrollView>
  );
}