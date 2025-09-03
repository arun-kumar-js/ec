import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoreScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('userData');
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'userData',
                'cartItems',
                'wishlistItems',
                'userToken',
              ]);
              navigation.reset({
                index: 0,
                routes: [{ name: 'AuthStack' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
            }
          },
        },
      ]
    );
  };

  const handleContact = (type) => {
    switch (type) {
      case 'call':
        Linking.openURL('tel:+919876543210');
        break;
      case 'whatsapp':
        Linking.openURL('whatsapp://send?phone=919876543210&text=Hello, I need help.');
        break;
      case 'email':
        Linking.openURL('mailto:support@spiderekart.com');
        break;
      case 'website':
        Linking.openURL('https://spiderekart.com');
        break;
    }
  };

  const menuItems = [
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      id: 'orders',
      title: 'My Orders',
      icon: 'bag-outline',
      onPress: () => navigation.navigate('TrackOrder'),
    },
    {
      id: 'wishlist',
      title: 'Wishlist',
      icon: 'heart-outline',
      onPress: () => navigation.navigate('WishList'),
    },
    {
      id: 'addresses',
      title: 'My Addresses',
      icon: 'location-outline',
      onPress: () => navigation.navigate('AddressPage'),
    },
    {
      id: 'about',
      title: 'About Us',
      icon: 'information-circle-outline',
      onPress: () => navigation.navigate('About'),
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: 'call-outline',
      onPress: () => navigation.navigate('contact'),
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: 'help-circle-outline',
      onPress: () => navigation.navigate('Faq'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-outline',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'document-text-outline',
      onPress: () => navigation.navigate('Terms'),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out-outline',
      onPress: handleLogout,
      color: '#ff4444',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Icon name="person" size={wp('12%')} color="#fff" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {userData?.name || 'Guest User'}
            </Text>
            <Text style={styles.userEmail}>
              {userData?.email || 'guest@example.com'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Icon
                  name={item.icon}
                  size={wp('5%')}
                  color={item.color || '#333'}
                />
                <Text style={[styles.menuItemText, item.color && { color: item.color }]}>
                  {item.title}
                </Text>
              </View>
              <Icon name="chevron-forward" size={wp('4%')} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Contact */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContact('call')}
            >
              <Icon name="call" size={wp('5%')} color="#fff" />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: '#25D366' }]}
              onPress={() => handleContact('whatsapp')}
            >
              <Icon name="logo-whatsapp" size={wp('5%')} color="#fff" />
              <Text style={styles.contactButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactButton, { backgroundColor: '#007AFF' }]}
              onPress={() => handleContact('email')}
            >
              <Icon name="mail" size={wp('5%')} color="#fff" />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    marginBottom: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  userEmail: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: wp('4%'),
    color: '#333',
    marginLeft: wp('3%'),
  },
  contactSection: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('2%'),
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    minWidth: wp('20%'),
  },
  contactButtonText: {
    color: '#fff',
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
  },
  versionText: {
    fontSize: wp('3%'),
    color: '#999',
  },
});

export default MoreScreen;
