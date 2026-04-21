import { StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '../context/ThemeContext';

export const createProfileStyles = (colors: typeof DarkColors | typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /* ================= HEADER CARD ================= */
  headerCard: {
    margin: 15,
    marginTop: 38,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },

  handle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  coins: {
    color: colors.gold,
    marginLeft: 6,
    fontWeight: '600',
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  editText: {
    marginLeft: 4,
    fontWeight: '600',
    color: '#000',
  },

  /* ================= STATS ================= */
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  statValue: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },

  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  /* ================= FOLLOW ================= */
  followRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  followText: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  /* ================= BIO ================= */
  bio: {
    color: colors.textSecondary,
    fontSize: 13,
    marginHorizontal: 16,
    marginTop: 6,
    lineHeight: 18,
  },

  /* ================= SECTION ================= */
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  /* ================= ACHIEVEMENTS ================= */
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 10,
    marginBottom: 10,
  },

  achievementCircle: {
    alignItems: 'center',
  },

  achievementLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 6,
  },

  /* ================= TABS ================= */
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: 30,
    overflow: 'hidden',
  },

  activeTab: {
    flex: 1,
    backgroundColor: colors.gold,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },

  inactiveTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },

  inactiveTabText: {
    color: colors.textSecondary,
  },

  /* ================= POSTS ================= */
  postCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
  },

  postGame: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },

  postOpponent: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  postTime: {
    color: colors.textTertiary,
    fontSize: 11,
    marginTop: 4,
  },

  postCoins: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  badge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  /* ================= ACTIONS ================= */
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },

  actionText: {
    color: colors.textSecondary,
    marginLeft: 6,
    fontSize: 12,
  },

  /* ================= MODAL ================= */
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
  },

  modalContent: {
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  modalInput: {
    backgroundColor: colors.surfaceLight,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  modalButton: {
    backgroundColor: colors.gold,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});