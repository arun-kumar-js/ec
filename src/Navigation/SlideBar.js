import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SlideBar = props => {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => navigation.navigate('TrackOrder'),
    },
    {
      title: 'Wishlist',
      icon: 'heart-outline',
      onPress: () => navigation.navigate('Wishlist'),
    },
    {
      title: 'My Addresses',
      icon: 'location-outline',
      onPress: () => navigation.navigate('AddressPage'),
    },
    {
      title: 'About Us',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('About'),
    },
    {
      title: 'Contact Us',
      icon: 'call-outline',
      onPress: () => navigation.navigate('contact'),
    },
    {
      title: 'FAQ',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Faq'),
    },
    {
      title: 'Privacy Policy',
      icon: 'shield-checkmark-outline',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      title: 'Terms & Conditions',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('Terms'),
    },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('cartItems');
      await AsyncStorage.removeItem('wishlistItems');
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>SK</Text>
        </View>
        <Text style={styles.appName}>Spider E-Kart</Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Icon name={item.icon} size={24} color="#333" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e60023',
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default SlideBar;
