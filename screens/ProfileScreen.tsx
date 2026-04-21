import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { createProfileStyles } from '../styles/profileStyles';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const styles = createProfileStyles(colors);
  
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(
    '🏆 Professional gamer | COD & FIFA specialist | Available for high-stake matches'
  );

  const profile = {
    name: 'GameMasterPro',
    handle: '@gamemaster_pro',
    coins: 12450,
    wins: 156,
    losses: 89,
    winRate: 64,
    followers: 2400,
    following: 532,
    achievements: ['Champion', 'Sharpshooter', 'Veteran', 'Rising Star'],
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      game: 'Call of Duty',
      result: 'Victory',
      opponent: 'ShadowGamer',
      coins: 500,
      time: '2 hours ago',
      likes: 24,
      comments: 8,
      liked: false,
    },
    {
      id: 2,
      game: 'FIFA 24',
      result: 'Defeat',
      opponent: 'ProKicker99',
      coins: -300,
      time: '1 day ago',
      likes: 10,
      comments: 3,
      liked: false,
    },
    {
      id: 3,
      game: 'Fortnite',
      result: 'Victory',
      opponent: 'BuildMaster',
      coins: 750,
      time: '2 days ago',
      likes: 42,
      comments: 12,
      liked: false,
    },
  ]);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.headerCard}>
        <View style={styles.topRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="game-controller" size={28} color="#fff" />
          </View>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.handle}>{profile.handle}</Text>

            <View style={styles.coinRow}>
              <Ionicons name="logo-bitcoin" size={16} color={colors.gold} />
              <Text style={styles.coins}>
                {profile.coins.toLocaleString()} Coins
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={16} color="#000" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {profile.winRate}%
            </Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        {/* FOLLOW */}
        <View style={styles.followRow}>
          <Text style={styles.followText}>
            {profile.followers.toLocaleString()} Followers
          </Text>
          <Text style={styles.followText}>
            {profile.following} Following
          </Text>
        </View>
      </View>

      {/* BIO */}
      <Text style={styles.bio}>{bio}</Text>

      {/* ACHIEVEMENTS */}
      <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
      <View style={styles.achievementsRow}>
        {profile.achievements.map((ach, i) => (
          <View key={i} style={styles.achievementCircle}>
            <Ionicons name="trophy" size={20} color={colors.gold} />
            <Text style={styles.achievementLabel}>{ach}</Text>
          </View>
        ))}
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text style={styles.inactiveTabText}>Advertise Game</Text>
        </TouchableOpacity>
      </View>

      {/* POSTS */}
      {posts.map((post) => (
        <View key={post.id} style={styles.postCard}>
          
          {/* TOP ROW */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            
            <View>
              <Text style={styles.postGame}>{post.game}</Text>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      post.result === 'Victory'
                        ? colors.successLight
                        : colors.errorLight,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      post.result === 'Victory'
                        ? colors.success
                        : colors.error,
                    fontSize: 12,
                  }}
                >
                  {post.result}
                </Text>
              </View>

              <Text style={styles.postOpponent}>
                vs {post.opponent}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={[
                  styles.postCoins,
                  {
                    color:
                      post.coins > 0 ? colors.success : colors.error,
                  },
                ]}
              >
                {post.coins > 0 ? `+${post.coins}` : post.coins}
              </Text>

              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.actionsRow}>
            
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => toggleLike(post.id)}
            >
              <Ionicons
                name={post.liked ? 'heart' : 'heart-outline'}
                size={18}
                color={post.liked ? colors.error : colors.textSecondary}
              />
              <Text style={styles.actionText}>{post.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.actionText}>{post.comments}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

          </View>
        </View>
      ))}

      {/* MODAL */}
      <Modal visible={isEditing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Edit bio..."
              placeholderTextColor={colors.textTertiary}
              style={styles.modalInput}
              multiline
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsEditing(false)}
            >
              <Text style={styles.modalButtonText}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}