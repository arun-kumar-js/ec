import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressPageScreen = () => {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadAddresses();
    }, [])
  );

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
              await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
              setAddresses(updatedAddresses);
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.error('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address');
            }
          },
        },
      ]
    );
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const renderAddress = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressInfo}>
          <Text style={styles.addressName}>{item.name}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <View style={styles.addressActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddAddress', { address: item })}
          >
            <Icon name="create-outline" size={wp('4%')} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => deleteAddress(item.id)}
          >
            <Icon name="trash-outline" size={wp('4%')} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.addressText}>
        {item.city}, {item.state} {item.pincode}
      </Text>
      <Text style={styles.addressPhone}>Phone: {item.phone}</Text>
      
      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => setDefaultAddress(item.id)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp('6%')} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <View style={{ width: wp('6%') }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddAddress')}>
          <Icon name="add" size={wp('6%')} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="location-outline" size={wp('20%')} color="#ccc" />
          <Text style={styles.emptyTitle}>No addresses found</Text>
          <Text style={styles.emptySubtitle}>
            Add your first delivery address to get started
          </Text>
          <TouchableOpacity
            style={styles.addAddressButton}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.addressList}
        />
      )}

      {addresses.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <Icon name="add" size={wp('5%')} color="#fff" />
            <Text style={styles.addNewText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  emptySubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  addAddressButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('2%'),
    borderRadius: wp('2%'),
  },
  addAddressText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  addressList: {
    padding: wp('4%'),
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp('2%'),
  },
  addressInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginRight: wp('2%'),
  },
  defaultBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('1%'),
  },
  defaultText: {
    color: '#fff',
    fontSize: wp('2.5%'),
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: wp('2%'),
    marginLeft: wp('1%'),
  },
  addressText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  addressPhone: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('2%'),
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: wp('1%'),
  },
  setDefaultText: {
    color: '#007AFF',
    fontSize: wp('3%'),
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addNewButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
  },
  addNewText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
});

export default AddressPageScreen;