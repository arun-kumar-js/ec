import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import CustomDrawerContent from './CustomDrawerContent';
import BottomTap from './BottomTap';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '75%',
        },
        drawerType: 'slide',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        drawerActiveTintColor: '#F70D24',
        drawerInactiveTintColor: '#666',
        swipeEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTap}
        options={{
          drawerLabel: 'Home',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
