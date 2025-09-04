import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const CustomDrawerContent = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load user', e);
      }
    };
    loadUser();
  }, []);

  const menuItems = [
    {
      icon: require('../Assets/icon/home.png'),
      label: 'Home',
      onPress: () => navigation.navigate('Home'),
    },
    {
      icon: require('../Assets/icon/cart.png'),
      label: 'Cart',
      onPress: () => navigation.navigate('Cart'),
    },
    {
      icon: require('../Assets/icon/bell.png'),
      label: 'Notifications',
      onPress: () => {
        Alert.alert('Notifications', 'No new notifications at the moment.');
      },
    },
    {
      icon: require('../Assets/icon/track.png'),
      label: 'Track Order',
      onPress: () => {
        Alert.alert('Track Order', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/refer.png'),
      label: 'Refer & Earn',
      onPress: () => {
        Alert.alert('Refer & Earn', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/phone.png'),
      label: 'Contact Us',
      onPress: () => {
        Alert.alert('Contact Us', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/about.png'),
      label: 'About Us',
      onPress: () => {
        Alert.alert('About Us', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/star.png'),
      label: 'Rate Us',
      onPress: () => {
        Alert.alert('Rate Us', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/share.png'),
      label: 'Share App',
      onPress: () => {
        Alert.alert('Share App', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/FAQ.png'),
      label: 'FAQ',
      onPress: () => {
        Alert.alert('FAQ', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/terms.png'),
      label: 'Terms & Conditions',
      onPress: () => {
        Alert.alert('Terms & Conditions', 'Feature coming soon.');
      },
    },
    {
      icon: require('../Assets/icon/privacy.png'),
      label: 'Privacy Policy',
      onPress: () => {
        Alert.alert('Privacy Policy', 'Feature coming soon.');
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {user ? (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../Assets/Images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.loginText}>{user.name || 'User'}</Text>
            <Text style={styles.phoneText}>{user.mobile || ''}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>Login ?</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.drawerList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemContent}>
              <Image source={item.icon} style={styles.menuIcon} />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.menuItem}
          onPress={async () => {
            await AsyncStorage.removeItem('userData');
            navigation.replace('Login');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Yes',
                  onPress: () =>
                    console.log('Delete account API call here'),
                },
              ],
            );
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.menuItemText, { color: 'red' }]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#EF3340',
    alignItems: 'center',
    paddingVertical: hp('4%'),
    paddingHorizontal: wp('4%'),
  },
  logo: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    marginBottom: hp('1%'),
  },
  loginText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  phoneText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontFamily: 'Montserrat-Regular',
    marginTop: hp('0.5%'),
  },
  drawerList: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: hp('1%'),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: wp('6%'),
    height: wp('6%'),
    marginRight: wp('4%'),
  },
  menuItemText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: wp('3.8%'),
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default CustomDrawerContent;
