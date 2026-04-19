import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  /* ================= HEADER CARD ================= */
  headerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#111827',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  handle: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 2,
  },

  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  coins: {
    color: '#facc15',
    marginLeft: 6,
    fontWeight: '600',
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#facc15',
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
    backgroundColor: '#1f2937',
    marginHorizontal: 4,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  statValue: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: 'bold',
  },

  statLabel: {
    color: '#9ca3af',
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
    color: '#9ca3af',
    fontSize: 13,
  },

  /* ================= BIO ================= */
  bio: {
    color: '#9ca3af',
    fontSize: 13,
    marginHorizontal: 16,
    marginTop: 6,
    lineHeight: 18,
  },

  /* ================= SECTION ================= */
  sectionTitle: {
    color: '#fff',
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
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 6,
  },

  /* ================= TABS ================= */
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#1f2937',
    borderRadius: 30,
    overflow: 'hidden',
  },

  activeTab: {
    flex: 1,
    backgroundColor: '#f59e0b',
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
    color: '#9ca3af',
  },

  /* ================= POSTS ================= */
  postCard: {
    backgroundColor: '#1f2937',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    padding: 16,
  },

  postGame: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    
  },

  postOpponent: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },

  postTime: {
    color: '#6b7280',
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
    display: 'flex',
    paddingHorizontal: 5, 
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },

  actionText: {
    color: '#9ca3af',
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
    backgroundColor: '#111827',
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  modalInput: {
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  modalButton: {
    backgroundColor: '#facc15',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});