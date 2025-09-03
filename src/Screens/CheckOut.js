import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckOutScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartItems();
    loadDefaultAddress();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await AsyncStorage.getItem('cartItems');
      if (items) {
        setCartItems(JSON.parse(items));
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const loadDefaultAddress = async () => {
    try {
      const addresses = await AsyncStorage.getItem('userAddresses');
      if (addresses) {
        const addressList = JSON.parse(addresses);
        if (addressList.length > 0) {
          setSelectedAddress(addressList[0]);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = subtotal > 500 ? 0 : 50;
    return subtotal + deliveryFee;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    setLoading(true);
    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      await AsyncStorage.removeItem('cartItems');
      
      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been placed and will be delivered soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainStack' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</Text>
    </View>
  );

  const renderAddressSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="location-outline" size={wp('5%')} color="#007AFF" />
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddressPage')}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
      
      {selectedAddress ? (
        <View style={styles.addressCard}>
          <Text style={styles.addressName}>{selectedAddress.name}</Text>
          <Text style={styles.addressText}>{selectedAddress.address}</Text>
          <Text style={styles.addressText}>
            {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
          </Text>
          <Text style={styles.addressPhone}>Phone: {selectedAddress.phone}</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <Icon name="add" size={wp('5%')} color="#007AFF" />
          <Text style={styles.addAddressText}>Add Delivery Address</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderPaymentSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Icon name="card-outline" size={wp('5%')} color="#007AFF" />
        <Text style={styles.sectionTitle}>Payment Method</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.paymentOption,
          paymentMethod === 'cod' && styles.selectedPaymentOption,
        ]}
        onPress={() => setPaymentMethod('cod')}
      >
        <Icon name="cash-outline" size={wp('5%')} color="#007AFF" />
        <Text style={styles.paymentText}>Cash on Delivery</Text>
        {paymentMethod === 'cod' && (
          <Icon name="checkmark-circle" size={wp('5%')} color="#007AFF" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.paymentOption,
          paymentMethod === 'online' && styles.selectedPaymentOption,
        ]}
        onPress={() => setPaymentMethod('online')}
      >
        <Icon name="card" size={wp('5%')} color="#007AFF" />
        <Text style={styles.paymentText}>Online Payment</Text>
        {paymentMethod === 'online' && (
          <Icon name="checkmark-circle" size={wp('5%')} color="#007AFF" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: wp('6%') }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderAddressSection()}
        {renderPaymentSection()}

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="receipt-outline" size={wp('5%')} color="#007AFF" />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          
          {cartItems.map((item, index) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Order Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₹{calculateSubtotal().toFixed(2)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery Fee:</Text>
          <Text style={styles.totalValue}>
            {calculateSubtotal() > 500 ? 'Free' : '₹50.00'}
          </Text>
        </View>
        <View style={[styles.totalRow, styles.finalTotal]}>
          <Text style={styles.finalTotalLabel}>Total:</Text>
          <Text style={styles.finalTotalValue}>₹{calculateTotal().toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.placeOrderText}>Placing Order...</Text>
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
    padding: wp('4%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginLeft: wp('2%'),
    flex: 1,
  },
  changeText: {
    fontSize: wp('3.5%'),
    color: '#007AFF',
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: '#f9f9f9',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  addressText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  addressPhone: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginTop: hp('1%'),
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: wp('2%'),
  },
  addAddressText: {
    fontSize: wp('4%'),
    color: '#007AFF',
    marginLeft: wp('2%'),
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  selectedPaymentOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  paymentText: {
    fontSize: wp('4%'),
    color: '#333',
    marginLeft: wp('2%'),
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: wp('3.5%'),
    color: '#333',
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: wp('3%'),
    color: '#666',
    marginTop: hp('0.5%'),
  },
  itemPrice: {
    fontSize: wp('4%'),
    color: '#007AFF',
    fontWeight: '600',
  },
  totalSection: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  totalLabel: {
    fontSize: wp('4%'),
    color: '#666',
  },
  totalValue: {
    fontSize: wp('4%'),
    color: '#333',
    fontWeight: '500',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: hp('2%'),
    marginTop: hp('1%'),
  },
  finalTotalLabel: {
    fontSize: wp('5%'),
    color: '#333',
    fontWeight: '600',
  },
  finalTotalValue: {
    fontSize: wp('5%'),
    color: '#007AFF',
    fontWeight: 'bold',
  },
  placeOrderButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});

export default CheckOutScreen;
