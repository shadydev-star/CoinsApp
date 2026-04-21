import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createServersStyles } from '../styles/serversStyles';

// Types
interface ReadyPlayer {
  id: string;
  name: string;
  avatar: string;
  game: string;
  stake: number;
  timestamp: Date;
}

interface Server {
  id: string;
  name: string;
  game: string;
  players: number;
  maxPlayers: number;
  status: 'active' | 'full' | 'in_game';
  type: 'public' | 'private';
  password?: string;
}

export default function ServersScreen() {
  const { colors } = useTheme();
  const styles = createServersStyles(colors);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [newServerName, setNewServerName] = useState('');
  const [newServerGame, setNewServerGame] = useState('Call of Duty');
  const [newServerIsPrivate, setNewServerIsPrivate] = useState(false);
  const [newServerPassword, setNewServerPassword] = useState('');

  // Mock ready players data
  const [readyPlayers] = useState<ReadyPlayer[]>([
    {
      id: '1',
      name: 'ShadowGamer',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      game: 'Call of Duty',
      stake: 500,
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: '2',
      name: 'ProKicker99',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      game: 'FIFA 24',
      stake: 1000,
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '3',
      name: 'SniperElite',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      game: 'Valorant',
      stake: 750,
      timestamp: new Date(Date.now() - 600000),
    },
  ]);

  // Mock servers data
  const [servers, setServers] = useState<Server[]>([
    {
      id: '1',
      name: 'COD Pro League',
      game: 'Call of Duty',
      players: 124,
      maxPlayers: 200,
      status: 'active',
      type: 'public',
    },
    {
      id: '2',
      name: 'FIFA Champions Cup',
      game: 'FIFA 24',
      players: 89,
      maxPlayers: 100,
      status: 'active',
      type: 'public',
    },
    {
      id: '3',
      name: 'Fortnite Elite Squad',
      game: 'Fortnite',
      players: 56,
      maxPlayers: 80,
      status: 'active',
      type: 'private',
    },
    {
      id: '4',
      name: 'Valorant Ranked',
      game: 'Valorant',
      players: 203,
      maxPlayers: 250,
      status: 'in_game',
      type: 'public',
    },
  ]);

  const handleAcceptChallenge = (player: ReadyPlayer) => {
    Alert.alert(
      'Accept Challenge',
      `Accept ${player.name}'s challenge for ${player.stake} coins in ${player.game}?`,
      [
        { text: 'Decline', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            Alert.alert(
              'Challenge Accepted!',
              `You've been matched with ${player.name}. Head to chat to negotiate!`
            );
          },
        },
      ]
    );
  };

  const handleJoinServer = (server: Server) => {
    if (server.type === 'private') {
      Alert.prompt(
        'Private Server',
        'Enter password to join:',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Join',
            onPress: (password) => {
              if (password === '12345') {
                Alert.alert('Joined!', `You've joined ${server.name}`);
              } else {
                Alert.alert('Error', 'Incorrect password');
              }
            },
          },
        ],
        'secure-text'
      );
    } else {
      Alert.alert('Join Server', `Join ${server.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Join', onPress: () => Alert.alert('Joined!', `Welcome to ${server.name}`) },
      ]);
    }
  };

  const handleInvitePlayer = (player: ReadyPlayer) => {
    Alert.alert('Invite Sent', `You've invited ${player.name} to a 1v1 match!`);
    setShowInviteModal(false);
  };

  const createServer = () => {
    if (!newServerName.trim()) {
      Alert.alert('Error', 'Please enter a server name');
      return;
    }

    const newServer: Server = {
      id: Date.now().toString(),
      name: newServerName,
      game: newServerGame,
      players: 1,
      maxPlayers: 50,
      status: 'active',
      type: newServerIsPrivate ? 'private' : 'public',
      password: newServerIsPrivate ? newServerPassword : undefined,
    };

    setServers([newServer, ...servers]);
    setShowCreateModal(false);
    setNewServerName('');
    setNewServerGame('Call of Duty');
    setNewServerIsPrivate(false);
    setNewServerPassword('');
    Alert.alert('Success', `Server "${newServerName}" created!`);
  };

  const renderReadyPlayer = ({ item }: { item: ReadyPlayer }) => (
    <TouchableOpacity style={styles.readyCard} onPress={() => handleAcceptChallenge(item)}>
      <View style={styles.readyHeader}>
        <Text style={styles.readyName}>{item.name}</Text>
        <View style={styles.readyBadge}>
          <Text style={styles.readyBadgeText}>Ready</Text>
        </View>
      </View>
      <Text style={styles.readyGame}>{item.game}</Text>
      <Text style={styles.readyStake}>💰 {item.stake} coins</Text>
      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcceptChallenge(item)}>
        <Text style={styles.acceptButtonText}>Accept Challenge</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderServer = ({ item }: { item: Server }) => (
    <TouchableOpacity style={styles.serverCard} onPress={() => handleJoinServer(item)}>
      <View style={styles.serverInfo}>
        <Text style={styles.serverName}>
          {item.name} {item.type === 'private' && '🔒'}
        </Text>
        <View style={styles.serverDetails}>
          <Text style={styles.serverPlayers}>👥 {item.players}/{item.maxPlayers}</Text>
          <Text style={styles.serverGame}>🎮 {item.game}</Text>
        </View>
        <TouchableOpacity style={styles.joinButton} onPress={() => handleJoinServer(item)}>
          <Text style={styles.joinButtonText}>Join Server</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.serverStatus}>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? colors.success : colors.error }]} />
        <Text style={styles.statusText}>
          {item.status === 'active' ? 'Active' : 'In Game'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Servers</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {/* Ready Players Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🎮 Ready to Contest</Text>
          <TouchableOpacity onPress={() => setShowInviteModal(true)}>
            <Text style={styles.sectionLink}>Invite 1v1 →</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={readyPlayers}
          renderItem={renderReadyPlayer}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.readyList}
        />
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 Upcoming Events</Text>
          <Text style={styles.sectionLink}>View All →</Text>
        </View>
        <View style={styles.serverList}>
          <View style={styles.serverCard}>
            <View>
              <Text style={styles.serverName}>🏆 Weekend Tournament</Text>
              <Text style={styles.serverDetailsText}>Starts in 2h • 500 coin entry</Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Available Servers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🌐 Available Servers</Text>
          <Text style={styles.sectionLink}>Refresh</Text>
        </View>
        <FlatList
          data={servers}
          renderItem={renderServer}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.serverList}
        />
      </View>

      {/* Create Server Modal */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Server</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Server Name"
              placeholderTextColor={colors.textTertiary}
              value={newServerName}
              onChangeText={setNewServerName}
            />
            
            <View style={styles.modalPicker}>
              {['Call of Duty', 'FIFA 24', 'Fortnite', 'Valorant'].map(game => (
                <TouchableOpacity
                  key={game}
                  onPress={() => setNewServerGame(game)}
                  style={[
                    styles.pickerText,
                    newServerGame === game && { backgroundColor: colors.goldLight }
                  ]}
                >
                  <Text style={{ color: colors.textPrimary }}>{game}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              onPress={() => setNewServerIsPrivate(!newServerIsPrivate)}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            >
              <Ionicons 
                name={newServerIsPrivate ? 'checkbox' : 'square-outline'} 
                size={24} 
                color={colors.gold} 
              />
              <Text style={{ color: colors.textPrimary, marginLeft: 8 }}>Private Server</Text>
            </TouchableOpacity>
            
            {newServerIsPrivate && (
              <TextInput
                style={styles.modalInput}
                placeholder="Password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry
                value={newServerPassword}
                onChangeText={setNewServerPassword}
              />
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={styles.modalCancel}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={createServer} style={styles.modalConfirm}>
                <Text style={styles.modalConfirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Invite 1v1 Modal */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite to 1v1</Text>
            <FlatList
              data={readyPlayers}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.inviteItem} onPress={() => handleInvitePlayer(item)}>
                  <Image source={{ uri: item.avatar }} style={styles.inviteAvatar} />
                  <Text style={styles.inviteName}>{item.name}</Text>
                  <TouchableOpacity style={styles.inviteButton} onPress={() => handleInvitePlayer(item)}>
                    <Text style={styles.inviteButtonText}>Invite</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              style={styles.inviteList}
            />
            <TouchableOpacity onPress={() => setShowInviteModal(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}