import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createNotificationsStyles } from '../styles/notificationsStyles';

// Types
interface Notification {
  id: string;
  type: 'match' | 'coin' | 'like' | 'comment' | 'share' | 'event' | 'winner' | 'ready';
  title: string;
  message: string;
  time: string;
  read: boolean;
  timestamp: Date;
  actionRequired?: boolean;
  matchId?: string;
  coinAmount?: number;
  senderName?: string;
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const styles = createNotificationsStyles(colors);
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'match',
      title: 'Match Invite',
      message: 'ShadowGamer challenged you to a 500 coin match!',
      time: '5 min ago',
      read: false,
      timestamp: new Date(Date.now() - 300000),
      actionRequired: true,
      matchId: 'match1',
      coinAmount: 500,
      senderName: 'ShadowGamer',
    },
    {
      id: '2',
      type: 'ready',
      title: 'Player Ready',
      message: 'ProKicker99 is ready to play FIFA for 1000 coins',
      time: '1 hour ago',
      read: false,
      timestamp: new Date(Date.now() - 3600000),
      actionRequired: true,
      coinAmount: 1000,
      senderName: 'ProKicker99',
    },
    {
      id: '3',
      type: 'coin',
      title: 'Coin Received',
      message: 'You received +750 coins from winning vs BuildMaster',
      time: '2 hours ago',
      read: true,
      timestamp: new Date(Date.now() - 7200000),
      coinAmount: 750,
    },
    {
      id: '4',
      type: 'like',
      title: 'Like',
      message: 'SniperPro liked your post',
      time: '1 day ago',
      read: true,
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '5',
      type: 'comment',
      title: 'Comment',
      message: 'DarkKnight commented: "Great game! Rematch?"',
      time: '1 day ago',
      read: true,
      timestamp: new Date(Date.now() - 90000000),
    },
    {
      id: '6',
      type: 'event',
      title: 'Server Event',
      message: 'COD Tournament starts in 2 hours! Register now.',
      time: '2 days ago',
      read: true,
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: '7',
      type: 'winner',
      title: 'Match Result',
      message: 'Moderator confirmed: You won against ShadowGamer! +500 coins',
      time: '3 days ago',
      read: true,
      timestamp: new Date(Date.now() - 259200000),
      coinAmount: 500,
    },
  ]);

  // Notification settings
  const [settings, setSettings] = useState({
    matchInvites: true,
    coinAlerts: true,
    likesAndComments: true,
    serverEvents: true,
    winnerAnnouncements: true,
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'match', label: 'Matches' },
    { id: 'coin', label: 'Coins' },
    { id: 'social', label: 'Social' },
    { id: 'event', label: 'Events' },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'match': return 'game-controller-outline';
      case 'ready': return 'person-add-outline';
      case 'coin': return 'logo-bitcoin';
      case 'like': return 'heart-outline';
      case 'comment': return 'chatbubble-outline';
      case 'share': return 'share-outline';
      case 'event': return 'calendar-outline';
      case 'winner': return 'trophy-outline';
      default: return 'notifications-outline';
    }
  };

  const filterNotifications = () => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'match') return notifications.filter(n => n.type === 'match' || n.type === 'ready');
    if (activeFilter === 'coin') return notifications.filter(n => n.type === 'coin' || n.type === 'winner');
    if (activeFilter === 'social') return notifications.filter(n => ['like', 'comment', 'share'].includes(n.type));
    if (activeFilter === 'event') return notifications.filter(n => n.type === 'event');
    return notifications;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    Alert.alert('Success', 'All notifications marked as read');
  };

  const handleAcceptMatch = (notification: Notification) => {
    Alert.alert(
      'Accept Challenge',
      `Accept ${notification.senderName}'s challenge for ${notification.coinAmount} coins?`,
      [
        { text: 'Decline', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            markAsRead(notification.id);
            Alert.alert('Challenge Accepted!', 'You have been matched. Head to chat to negotiate!');
          },
        },
      ]
    );
  };

  const handleDeclineMatch = (notification: Notification) => {
    Alert.alert(
      'Decline Challenge',
      `Decline ${notification.senderName}'s challenge?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            markAsRead(notification.id);
            Alert.alert('Challenge Declined');
          },
        },
      ]
    );
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unread]} 
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getIcon(item.type)} size={24} color={colors.gold} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        {item.actionRequired && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.acceptButton} 
              onPress={() => handleAcceptMatch(item)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.declineButton} 
              onPress={() => handleDeclineMatch(item)}
            >
              <Text style={styles.declineButtonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {!item.read && !item.actionRequired && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
              <Text style={styles.markAllText}>Mark all</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.markAllButton}>
            <Ionicons name="settings-outline" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal
       showsHorizontalScrollIndicator={false}
        style={styles.filterTabs}
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}>
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterTab, activeFilter === filter.id && styles.filterTabActive]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text style={[styles.filterTabText, activeFilter === filter.id && styles.filterTabTextActive]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notification List */}
      <FlatList
        data={filterNotifications()}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notificationList}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // 👈 spacing between cards
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.textTertiary} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>You're all caught up!</Text>
          </View>
        }
      />

      {/* Settings Modal */}
      <Modal visible={showSettings} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notification Settings</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Match Invites & Challenges</Text>
              <Switch
                value={settings.matchInvites}
                onValueChange={val => setSettings({...settings, matchInvites: val})}
                trackColor={{ false: colors.border, true: colors.gold }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Coin Transactions</Text>
              <Switch
                value={settings.coinAlerts}
                onValueChange={val => setSettings({...settings, coinAlerts: val})}
                trackColor={{ false: colors.border, true: colors.gold }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Likes, Comments & Shares</Text>
              <Switch
                value={settings.likesAndComments}
                onValueChange={val => setSettings({...settings, likesAndComments: val})}
                trackColor={{ false: colors.border, true: colors.gold }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Server Events</Text>
              <Switch
                value={settings.serverEvents}
                onValueChange={val => setSettings({...settings, serverEvents: val})}
                trackColor={{ false: colors.border, true: colors.gold }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Winner Announcements</Text>
              <Switch
                value={settings.winnerAnnouncements}
                onValueChange={val => setSettings({...settings, winnerAnnouncements: val})}
                trackColor={{ false: colors.border, true: colors.gold }}
              />
            </View>
            
            <TouchableOpacity 
              onPress={() => setShowSettings(false)} 
              style={[styles.modalCancel, { marginTop: 20, backgroundColor: colors.gold, borderWidth: 0 }]}
            >
              <Text style={[styles.modalCancelText, { color: colors.background, fontWeight: 'bold' }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}