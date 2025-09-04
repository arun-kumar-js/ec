import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const SimpleDrawer = ({ visible, onClose, navigation }) => {
  const [user, setUser] = useState(null);
  const slideAnim = React.useRef(
    new Animated.Value(-screenWidth * 0.6),
  ).current;

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

  React.useEffect(() => {
    console.log('SimpleDrawer visible changed:', visible);
    if (visible) {
      console.log('Opening drawer animation');
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false, // Changed to false to avoid animation issues
      }).start();
    } else {
      console.log('Closing drawer animation');
      Animated.timing(slideAnim, {
        toValue: -screenWidth * 0.6,
        duration: 300,
        useNativeDriver: false, // Changed to false to avoid animation issues
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    {
      icon: require('../Assets/icon/home.png'),
      label: 'Home',
      onPress: () => {
        onClose();
        navigation.navigate('Home');
      },
    },
    {
      icon: require('../Assets/icon/cart.png'),
      label: 'Cart',
      onPress: () => {
        onClose();
        navigation.navigate('Cart');
      },
    },
    {
      icon: require('../Assets/icon/bell.png'),
      label: 'Notifications',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/track.png'),
      label: 'Track Order',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/refer.png'),
      label: 'Refer & Earn',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/phone.png'),
      label: 'Contact Us',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/about.png'),
      label: 'About Us',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/star.png'),
      label: 'Rate Us',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/share.png'),
      label: 'Share App',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/FAQ.png'),
      label: 'FAQ',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/terms.png'),
      label: 'Terms & Conditions',
      onPress: () => {
        onClose();
      },
    },
    {
      icon: require('../Assets/icon/privacy.png'),
      label: 'Privacy Policy',
      onPress: () => {
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.drawerContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.drawerContent}
            onPress={() => {}} // Prevent closing when tapping inside drawer
            activeOpacity={1}
          >
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
                  onPress={() => {
                    onClose();
                    navigation.navigate('Login');
                  }}
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
                  onClose();
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
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    width: screenWidth * 0.6,
    height: '100%',
    backgroundColor: '#fff',
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    backgroundColor: '#EF3340',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  phoneText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginTop: 4,
  },
  drawerList: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  menuItemText: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default SimpleDrawer;
