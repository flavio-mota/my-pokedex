import { StyleSheet } from 'react-native';
import type { Theme } from '../../global/themes';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 32,
      paddingTop: 72,
      paddingBottom: 24,
    },

    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    listContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 12,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    cardLeft: {
      flex: 1,
      marginRight: 12,
    },
    cardName: {
      fontSize: 18,
      fontWeight: '700',
      textTransform: 'capitalize',
      marginBottom: 8,
      color: theme.colors.text,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    typeBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    typeText: {
      fontSize: 12,
      textTransform: 'capitalize',
      color: theme.colors.text,
    },
    cardImage: {
      width: 72,
      height: 72,
    },
    boxBottom: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    buttomSair: {
      height: 35,
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      borderWidth: 1,
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.primaryDark,
    },
    buttomSairText:{
      color: theme.colors.text,
      fontWeight: 'bold',
    }
    
  });

