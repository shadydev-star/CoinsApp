import { StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '../context/ThemeContext';

export const createServersStyles = (colors: typeof DarkColors | typeof LightColors) => StyleSheet.create({
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
  createButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionLink: {
    color: colors.gold,
    fontSize: 14,
  },
  readyList: {
    paddingLeft: 20,
  },
  readyCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    borderWidth: 1,
    borderColor: colors.goldLight,
  },
  readyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readyName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  readyBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  readyBadgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  readyGame: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  readyStake: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  acceptButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  serverList: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  serverCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  serverDetails: {
    flexDirection: 'row',
    marginTop: 6,
  },
  serverPlayers: {
    color: colors.textSecondary,
    fontSize: 12,
    marginRight: 12,
  },
  serverGame: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  serverDetailsText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  serverStatus: {
    alignItems: 'flex-end',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  joinButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 12,
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
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: colors.surfaceLight,
    color: colors.textPrimary,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalPicker: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    marginBottom: 16,
  },
  pickerText: {
    color: colors.textPrimary,
    padding: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  modalCancelText: {
    color: colors.textSecondary,
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: colors.gold,
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: colors.background,
    fontWeight: 'bold',
  },
  inviteList: {
    maxHeight: 300,
  },
  inviteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inviteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  inviteName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  inviteButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inviteButtonText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 11,
  },
});