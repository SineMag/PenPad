import { AppColors } from '@/constants/AppColors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Sidebar } from '@/components/Sidebar';

  if (isDesktop) {
    // Desktop layout with sidebar
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Sidebar />
        <View style={{ flex: 1, backgroundColor: themeColors.background }}>
          <Tabs
            screenOptions={{
              tabBarStyle: { display: 'none' }, // Hide bottom tabs on desktop
              headerShown: false,
            }}>
            <Tabs.Screen name="index" options={{ href: '/(app)/(tabs)' }} />
            <Tabs.Screen name="work" options={{ href: '/(app)/(tabs)/work' }} />
            <Tabs.Screen name="study" options={{ href: '/(app)/(tabs)/study' }} />
            <Tabs.Screen name="personal" options={{ href: '/(app)/(tabs)/personal' }} />
            <Tabs.Screen name="profile" options={{ href: '/(app)/(tabs)/profile' }} />
          </Tabs>
        </View>
      </View>
    );
  }

  // Mobile layout with bottom tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'All Notes',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="note-multiple" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="work"
        options={{
          title: 'Work',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="briefcase" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="book-open-variant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="personal"
        options={{
          title: 'Personal',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
