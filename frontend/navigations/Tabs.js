import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Keyboard } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HomeScreen from '../screens/HomeScreen';
import ListsScreen from '../screens/ListsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import AddTypeScreen from '../screens/AddTypeScreen';
import AddDetailScreen from '../screens/AddDetailScreen';
import ViewPhotos from '../screens/ViewPhotos';
import CompareScreen1 from '../screens/CompareScreen1';
import CompareScreen2 from '../screens/CompareScreen2';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CatStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Choose Categories" component={AddCategoryScreen} />
        <Stack.Screen name="Choose Type" component={AddTypeScreen} />
        <Stack.Screen name="Add/Edit Details" component={AddDetailScreen} />
        <Stack.Screen name="ViewPhotos" component={ViewPhotos} />
    </Stack.Navigator>
);

const CompStack = () => (
  <Stack.Navigator>
    <Stack.Screen name = "Search Compare" component={CompareScreen1}/>
    <Stack.Screen name = "Price Compare" component={CompareScreen2} />
  </Stack.Navigator>
)

const Tabs = () => {
  const [tabBarVisible, setTabBarVisible] = useState(true);
  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTabBarVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTabBarVisible(true);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

    return(
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
      
            if (route.name === 'Home') {
              iconName ='home' ;
            } else if (route.name === 'Compare') {
              iconName = "balance-scale";
            } else if (route.name === 'Add Groceries') {
              iconName = 'plus';
            } else if (route.name === 'Lists') {
              iconName = 'list';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            }
      
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#F6E9BE',
          tabBarInactiveTintColor: '#F6E9BE',
          tabBarStyle: { backgroundColor: '#00806C' },
          tabBarVisible: tabBarVisible 
        })}
      >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Compare" component={CompStack} />
          <Tab.Screen name="Add Groceries" component={CatStack}/>
          <Tab.Screen name="Lists" component={ListsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          
        </Tab.Navigator>
    );
}

export default Tabs;