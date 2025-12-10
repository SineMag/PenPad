import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="note/[id]" options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="note/add" options={{ presentation: 'modal', headerShown: false }} />
    </Stack>
  );
}
