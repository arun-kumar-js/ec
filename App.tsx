// App.tsx

// MUST be at the top — before any other imports
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTap from './src/Navigation/BottomTap';
import AddressPage from './src/Screens/AddressPage';
import AddAddress from './src/Screens/AddAddress';
import SubCategory from './src/Screens/SubCategory';
import ProductDetails from './src/Screens/ProductDetails';
import Cart from './src/Screens/Cart';
import CheckOut from './src/Screens/CheckOut';
import Payment from './src/Screens/Payment';
import OrderConfirmed from './src/Screens/OrderConfirmed';
import BillPlzWebView from './src/Screens/BillPlzWebView';
import Login from './src/Screens/Login';
import OtpScreen from './src/Screens/OtpScreen';
import Profile from './src/Screens/Profile';
import Orders from './src/Screens/Orders';
import Settings from './src/Screens/Settings';
import Support from './src/Screens/Support';
import About from './src/Screens/About';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainApp"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="MainApp" component={BottomTap} />
        <Stack.Screen
          name="AddressPage"
          component={AddressPage}
          options={{
            headerShown: true,
            title: 'Choose Address',
            headerStyle: { backgroundColor: '#EF3340' },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen name="AddAddress" component={AddAddress} />
        <Stack.Screen name="SubCategory" component={SubCategory} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="CheckOut" component={CheckOut} />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="OrderConfirmed" component={OrderConfirmed} />
        <Stack.Screen name="BillPlzWebView" component={BillPlzWebView} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
