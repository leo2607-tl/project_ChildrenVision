import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './screens/ProfileScreen';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import HideScreen from './screens/HideScreen';
import PlayScreen from './screens/FruitScreen';
import EdgeScreen from './screens/EdgeScreen';
import SettingsScreen from './screens/SettingsScreen';
import DrawScreen from './screens/DrawScreen';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Setting: undefined;
  Hide: undefined;
  Fruit: undefined;
  Draw: undefined;
  Edge: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else {
            iconName = 'help-circle-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: '#fff',
        },
        tabBarActiveTintColor: '#8A008FFF', 
        tabBarInactiveTintColor: 'gray', 
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen} 
        options={{
          tabBarLabel: 'Trang Chủ',
        }}
      />
        <Tab.Screen
        name="Setting"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Camera',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Thông Tin',
        }}
      />
    </Tab.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Hide" component={HideScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Fruit" component={PlayScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Draw" component={DrawScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Edge" component={EdgeScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarstyle: {
    height: 45,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: 'transparent',
  },
});