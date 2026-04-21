import { StyleSheet } from 'react-native';
import { DarkColors, LightColors } from '../context/ThemeContext';

// Dynamic styles that accept colors
export const createSettingsStyles = (colors: typeof DarkColors | typeof LightColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 38,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  settingSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  themeOptionSelected: {
    backgroundColor: colors.goldLight,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  themeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  themeText: {
    color: colors.textPrimary,
    fontSize: 16,
    flex: 1,
  },
  themeCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: colors.errorLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  // Wallet Card
  walletCard: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
  },
  walletBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.gold,
    marginTop: 8,
  },
  walletLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  // Transaction History
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionGame: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  transactionOpponent: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  transactionTime: {
    color: colors.textTertiary,
    fontSize: 10,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});