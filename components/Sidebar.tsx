import { ThemedText } from '@/components/ThemedText';
import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Link, usePathname } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SidebarItem {
  name: string;
  title: string;
  icon: string;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { name: 'index', title: 'All Notes', icon: 'note-multiple', href: '/(app)/(tabs)' },
  { name: 'work', title: 'Work', icon: 'briefcase', href: '/(app)/(tabs)/work' },
  { name: 'study', title: 'Study', icon: 'book-open-variant', href: '/(app)/(tabs)/study' },
  { name: 'personal', title: 'Personal', icon: 'home-heart', href: '/(app)/(tabs)/personal' },
  { name: 'profile', title: 'Profile', icon: 'account', href: '/(app)/(tabs)/profile' },
];

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const colorScheme = useColorScheme();
  const themeColors = AppColors[colorScheme ?? 'light'];
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/(app)/(tabs)') {
      return pathname === href || pathname === '/(app)/(tabs)/index';
    }
    return pathname === href;
  };

  return (
    <View style={[
      styles.sidebar,
      isCollapsed ? styles.collapsed : styles.expanded,
      { 
        backgroundColor: themeColors.cardBackground,
        borderRightColor: themeColors.border 
      }
    ]}>
      {sidebarItems.map((item) => (
        <Link key={item.name} href={item.href} asChild>
          <TouchableOpacity
            style={[
              styles.sidebarItem,
              isCollapsed ? styles.collapsedItem : styles.expandedItem,
              isActive(item.href) && [
                styles.activeItem,
                { backgroundColor: themeColors.primary }
              ]
            ]}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={
                isActive(item.href) 
                  ? '#FFFFFF' 
                  : themeColors.tabIconDefault
              }
            />
            {!isCollapsed && (
              <ThemedText
                style={[
                  styles.sidebarText,
                  isActive(item.href) && styles.activeText
                ]}
              >
                {item.title}
              </ThemedText>
            )}
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    borderRightWidth: 1,
    height: '100%',
    paddingTop: 20,
    paddingBottom: 20,
  },
  expanded: {
    width: 240,
  },
  collapsed: {
    width: 80,
    alignItems: 'center',
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  expandedItem: {
    justifyContent: 'flex-start',
  },
  collapsedItem: {
    justifyContent: 'center',
  },
  activeItem: {
    // backgroundColor set dynamically
  },
  sidebarText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: '#FFFFFF',
  },
});
