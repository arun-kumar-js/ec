import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchUserAddresses, deleteAddress } from '../Fuctions/AddressService';

const ChooseAddressScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('=== ADDRESS PAGE LOADED ===');

        // Check all AsyncStorage keys
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('All AsyncStorage keys:', allKeys);

        const storedUser = await AsyncStorage.getItem('userData');
        console.log('Raw stored user data:', storedUser);

        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          setUser(userObj);
          console.log('Parsed user object:', userObj);
          console.log('User ID:', userObj.user_id || userObj.id);

          // Test with hardcoded user ID first
          console.log('=== TESTING WITH USER ID 1 ===');
          const testAddresses = await fetchUserAddresses('1');
          console.log('Test addresses result:', testAddresses);

          // Now try with actual user ID
          console.log('=== CALLING FETCH USER ADDRESSES ===');
          console.log('User Object:', userObj);
          console.log('User ID being passed:', userObj.user_id || userObj.id);
          const addressesData = await fetchUserAddresses(
            userObj.user_id || userObj.id,
          );
          setAddresses(addressesData);
          // Set first address as default selected
          if (addressesData.length > 0) {
            setSelectedAddressId(addressesData[0].id);
          }
          console.log('=== ADDRESSES SET IN STATE ===');
          console.log('Addresses Data:', addressesData);
          console.log('Addresses Count:', addressesData.length);
        } else {
          console.warn('No user data found in AsyncStorage');
          console.log('=== TESTING WITHOUT USER DATA ===');
          // Test with hardcoded user ID
          const testAddresses = await fetchUserAddresses('1');
          console.log('Test addresses without user data:', testAddresses);
          setAddresses(testAddresses);
          // Set first address as default selected
          if (testAddresses.length > 0) {
            setSelectedAddressId(testAddresses[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        Alert.alert('Error', 'Failed to fetch addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    const isSelected = selectedAddressId === item.id;

    return (
      <TouchableOpacity
        style={[styles.addressCard, isSelected && styles.selectedAddressCard]}
        onPress={() => setSelectedAddressId(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.addressContent}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              isSelected && styles.selectedRadioButton,
            ]}
            onPress={() => setSelectedAddressId(item.id)}
            activeOpacity={0.7}
          >
            {isSelected && <View style={styles.radioDot} />}
          </TouchableOpacity>

          <View style={styles.addressDetails}>
            <Text style={styles.addressName}>{item.name}</Text>
            <Text style={styles.addressText}>
              {item.address}, {item.landmark}
            </Text>
            <Text style={styles.addressText}>
              {item.city}, {item.state} - {item.pincode}
            </Text>
            <Text style={styles.addressText}>Mobile: {item.mobile}</Text>

            <View style={styles.addressActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  console.log('Edit address:', item.id);
                  // TODO: Navigate to edit address screen
                  Alert.alert('Edit', 'Edit functionality coming soon');
                }}
              >
                <Icon name="pencil" size={16} color="#EF3340" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteAddress(item.id)}
              >
                <Icon name="trash-outline" size={16} color="#EF3340" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDeleteAddress = async addressId => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (user && (user.user_id || user.id)) {
              const result = await deleteAddress(
                addressId,
                user.user_id || user.id,
              );
              if (result.success) {
                // Refresh addresses after deletion
                const updatedAddresses = await fetchUserAddresses(
                  user.user_id || user.id,
                );
                setAddresses(updatedAddresses);
                Alert.alert('Success', 'Address deleted successfully');
              } else {
                Alert.alert('Error', result.message);
              }
            }
          },
        },
      ],
    );
  };

  const handleContinue = () => {
    // Find the selected address
    const selectedAddress = addresses.find(
      addr => addr.id === selectedAddressId,
    );
    if (selectedAddress) {
      // Navigate to checkout with selected address details
      navigation.navigate('CheckOut', {
        selectedAddress: {
          name: selectedAddress.name,
          address: selectedAddress.address,
          mobile: selectedAddress.mobile,
          email: selectedAddress.email || 'user@example.com', // fallback if email not available
        },
      });
    } else {
      Alert.alert('Error', 'Please select an address to continue');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#EF3340" />
      ) : addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../Assets/Images/No-Address.png')}
            style={styles.image}
          />
          <Text style={styles.title}>No Address Found</Text>
          <Text style={styles.subtitle}>
            Add your first address to continue
          </Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={addresses}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            removeClippedSubviews={false}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ width: '100%' }}
          />
        </View>
      )}

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (user && (user.user_id || user.id)) {
              navigation.navigate('AddAddress', {
                user_id: user.user_id || user.id,
              });
            }
          }}
        >
          <Icon name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        {addresses.length > 0 && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

const AddressPage: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#EF3340" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#EF3340',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'normal',
            fontSize: 20,
          },
          headerTitleAlign: 'left',
          headerShown: false,
        }}
      >
        <Stack.Screen name="ChooseAddress" component={ChooseAddressScreen} />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  addressCard: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedAddressCard: {
    borderColor: '#EF3340',
    borderWidth: 2,
    backgroundColor: '#fff5f5',
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  selectedCircle: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    marginTop: 2,
  },
  selectedRadioButton: {
    borderColor: '#EF3340',
    backgroundColor: '#fff',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF3340',
  },
  addressDetails: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    fontSize: 12,
    color: '#EF3340',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#EF3340',
    gap: 5,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EF3340',
    backgroundColor: '#fff',
    gap: 3,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#EF3340',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#EF3340',
    fontWeight: '500',
  },
  addressName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
    lineHeight: 20,
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 15,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#EF3340',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#EF3340',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});

export default AddressPage;
