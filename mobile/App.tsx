import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import HomeScreen from './src/screens/HomeScreen';
import CollectionScreen from './src/screens/CollectionScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import EventsScreen from './src/screens/EventsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Tea Quest Adventures' }}
              />
              <Stack.Screen
                name="Collection"
                component={CollectionScreen}
                options={{ title: 'Tea Collection' }}
              />
              <Stack.Screen
                name="Achievements"
                component={AchievementsScreen}
                options={{ title: 'Achievements' }}
              />
              <Stack.Screen
                name="Events"
                component={EventsScreen}
                options={{ title: 'Weekly Events' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>
  );
}