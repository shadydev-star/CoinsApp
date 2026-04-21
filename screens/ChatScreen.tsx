import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { createChatStyles } from '../styles/chatStyles';

// Types
interface Message {
  id: string;
  text?: string;
  type: 'text' | 'coin_offer' | 'screenshot';
  sender: 'me' | 'them';
  timestamp: Date;
  coinAmount?: number;
  imageUri?: string;
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
  messages: Message[];
}

export default function ChatScreen() {
  const { colors } = useTheme();
  const styles = createChatStyles(colors);
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [coinAmount, setCoinAmount] = useState('');
  
  // Mock chats data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      name: 'ShadowGamer',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      lastMessage: 'Ready for 500 coin match?',
      time: '2m ago',
      unread: 2,
      messages: [
        {
          id: '1',
          text: 'Hey! Want to play?',
          type: 'text',
          sender: 'them',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '2',
          text: 'Sure! What game?',
          type: 'text',
          sender: 'me',
          timestamp: new Date(Date.now() - 3500000),
        },
        {
          id: '3',
          text: 'Ready for 500 coin match?',
          type: 'coin_offer',
          sender: 'them',
          timestamp: new Date(Date.now() - 120000),
          coinAmount: 500,
        },
      ],
    },
    {
      id: '2',
      name: 'ProKicker99',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      lastMessage: 'GG! Rematch?',
      time: '1h ago',
      unread: 0,
      messages: [
        {
          id: '1',
          text: 'Good game!',
          type: 'text',
          sender: 'them',
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    },
    {
      id: '3',
      name: 'COD Warriors',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      lastMessage: 'Tournament tonight at 8pm',
      time: '2d ago',
      unread: 5,
      isGroup: true,
      messages: [],
    },
  ]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'screenshot',
        sender: 'me',
        timestamp: new Date(),
        imageUri: result.assets[0].uri,
      };
      
      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: '📸 Sent a screenshot',
            time: 'Just now',
          };
        }
        return chat;
      });
      
      setChats(updatedChats);
      setSelectedChat({
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
      });
    }
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      type: 'text',
      sender: 'me',
      timestamp: new Date(),
    };
    
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageText,
          time: 'Just now',
          unread: 0,
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    });
    setMessageText('');
  };

  const sendCoinOffer = () => {
    const amount = parseInt(coinAmount);
    if (isNaN(amount) || amount <= 0 || !selectedChat) {
      Alert.alert('Invalid Amount', 'Please enter a valid coin amount');
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'coin_offer',
      sender: 'me',
      timestamp: new Date(),
      coinAmount: amount,
    };
    
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: `💰 Offered ${amount} coins`,
          time: 'Just now',
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    });
    setShowCoinModal(false);
    setCoinAmount('');
  };

  const declareWinner = () => {
    Alert.alert(
      'Declare Winner',
      'Are you sure you want to declare yourself as the winner? This will send a request to moderators.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Declare Winner', 
          onPress: () => {
            Alert.alert('Request Sent', 'Your request has been sent to moderators for review.');
          }
        },
      ]
    );
  };

  const acceptCoinOffer = (amount: number) => {
    Alert.alert(
      'Accept Coin Offer',
      `Accept ${amount} coin stake? This will lock the coins until match is complete.`,
      [
        { text: 'Decline', style: 'cancel' },
        { 
          text: 'Accept', 
          onPress: () => {
            Alert.alert('Offer Accepted!', `Ready to play for ${amount} coins!`);
          }
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.type === 'coin_offer') {
      return (
        <View style={styles.coinOfferCard}>
          <Text style={styles.coinOfferAmount}>💰 {item.coinAmount} Coins</Text>
          <Text style={styles.coinOfferLabel}>Coin Stake Offer</Text>
          {item.sender === 'them' && (
            <TouchableOpacity 
              style={styles.acceptOfferButton}
              onPress={() => acceptCoinOffer(item.coinAmount || 0)}
            >
              <Text style={styles.acceptOfferText}>Accept Challenge</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.messageTime, { marginTop: 4 }]}>
            {item.timestamp.toLocaleTimeString()}
          </Text>
        </View>
      );
    }
    
    if (item.type === 'screenshot') {
      return (
        <View style={styles.screenshotMessage}>
          <Image source={{ uri: item.imageUri }} style={styles.screenshotImage} />
          <Text style={styles.screenshotLabel}>📸 Game Result Screenshot</Text>
          <Text style={styles.messageTime}>{item.timestamp.toLocaleTimeString()}</Text>
        </View>
      );
    }
    
    return (
      <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.theirMessage]}>
        <Text style={[styles.messageText, item.sender === 'me' && styles.myMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.messageTime, item.sender === 'me' && styles.myMessageTime]}>
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => setSelectedChat(item)}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.chatName}>{item.name}</Text>
            {item.isGroup && (
              <View style={styles.groupBadge}>
                <Text style={styles.groupText}>Group</Text>
              </View>
            )}
          </View>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedChat) {
    return (
      <View style={styles.chatWindow}>
        {/* Chat Header */}
        <View style={styles.chatWindowHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.gold} />
          </TouchableOpacity>
          <Text style={styles.chatWindowTitle}>{selectedChat.name}</Text>
          <TouchableOpacity onPress={declareWinner} style={styles.winnerButton}>
            <Text style={styles.winnerText}>🏆 Declare Winner</Text>
          </TouchableOpacity>
        </View>
        
        {/* Messages */}
        <FlatList
          data={selectedChat.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
        />
        
        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
            <Ionicons name="camera-outline" size={24} color={colors.gold} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCoinModal(true)} style={styles.coinButton}>
            <Text style={styles.coinButtonText}>💰 Offer</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color={colors.gold} />
          </TouchableOpacity>
        </View>
        
        {/* Coin Offer Modal */}
        <Modal visible={showCoinModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>💰 Coin Stake Offer</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter coin amount"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numeric"
                value={coinAmount}
                onChangeText={setCoinAmount}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowCoinModal(false)} style={styles.modalCancel}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={sendCoinOffer} style={styles.modalConfirm}>
                  <Text style={styles.modalConfirmText}>Send Offer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Text style={styles.newChatText}>+ New Chat</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />
    </View>
  );
}