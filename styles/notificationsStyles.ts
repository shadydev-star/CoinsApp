import { StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '../context/ThemeContext';

export const createNotificationsStyles = (colors: typeof DarkColors | typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 38,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '500',

  },
  filterTabs: {
    paddingHorizontal: 20,
  
    
  },
  filterTab: {
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    
  },
  filterTabActive: {
    backgroundColor: colors.gold,
    borderRadius: 20,
    paddingVertical: 2,
  
  },
  filterTabText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  filterTabTextActive: {
    color: colors.background,
    fontWeight: '600',

  },
  notificationList: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    
    alignItems: 'center',
  },
  unread: {
    backgroundColor: colors.surfaceLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  notificationTime: {
    color: colors.textTertiary,
    fontSize: 11,
  },
  notificationMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  acceptButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  acceptButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  declineButton: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  declineButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
  emptySubtext: {
    color: colors.textTertiary,
    fontSize: 14,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  modalCancel: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontWeight: 'bold',
  },
});