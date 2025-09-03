import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL, API_ACCESS_KEY } from '../config/config';

const TrackOrder = () => {
  const navigation = useNavigation();
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!orderNumber.trim()) {
      Alert.alert('Error', 'Please enter an order number');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      formData.append('order_id', orderNumber.trim());

      const response = await axios.post(
        `${API_BASE_URL}track-order.php`,
        formData,
      );

      if (response.data && response.data.error === 'false') {
        setOrderDetails(response.data.data);
      } else {
        Alert.alert('Error', response.data?.message || 'Order not found');
        setOrderDetails(null);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      Alert.alert('Error', 'Failed to track order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderStatus = status => {
    const statusConfig = {
      pending: { color: '#FFA500', icon: 'time-outline' },
      confirmed: { color: '#007AFF', icon: 'checkmark-circle-outline' },
      processing: { color: '#FF9500', icon: 'construct-outline' },
      shipped: { color: '#34C759', icon: 'car-outline' },
      delivered: { color: '#34C759', icon: 'checkmark-circle' },
      cancelled: { color: '#FF3B30', icon: 'close-circle-outline' },
    };

    const config =
      statusConfig[status?.toLowerCase()] || statusConfig['pending'];

    return (
      <View
        style={[
          styles.statusContainer,
          { backgroundColor: config.color + '20' },
        ]}
      >
        <Icon name={config.icon} size={wp('5%')} color={config.color} />
        <Text style={[styles.statusText, { color: config.color }]}>
          {status || 'Pending'}
        </Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemImageContainer}>
        <Icon name="image-outline" size={wp('8%')} color="#ccc" />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name || 'Product Name'}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
        <Text style={styles.itemPrice}>₹{item.price || '0'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: wp('6%') }} />
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Enter Order Number</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter your order number"
            value={orderNumber}
            onChangeText={setOrderNumber}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={trackOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Icon name="search" size={wp('5%')} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Details */}
      {orderDetails && (
        <View style={styles.orderDetails}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          {/* Order Status */}
          <View style={styles.statusSection}>
            {renderOrderStatus(orderDetails.status)}
          </View>

          {/* Order Info */}
          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Number:</Text>
              <Text style={styles.infoValue}>{orderDetails.order_id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date:</Text>
              <Text style={styles.infoValue}>{orderDetails.order_date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Amount:</Text>
              <Text style={styles.infoValue}>₹{orderDetails.total_amount}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <Text style={styles.infoValue}>
                {orderDetails.payment_method}
              </Text>
            </View>
          </View>

          {/* Order Items */}
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={orderDetails.items || []}
            renderItem={renderOrderItem}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
          />

          {/* Delivery Address */}
          {orderDetails.delivery_address && (
            <>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {orderDetails.delivery_address}
                </Text>
              </View>
            </>
          )}
        </View>
      )}

      {/* Empty State */}
      {!orderDetails && !loading && (
        <View style={styles.emptyState}>
          <Icon name="search-outline" size={wp('15%')} color="#ccc" />
          <Text style={styles.emptyText}>
            Enter an order number to track your order
          </Text>
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
    backgroundColor: '#e60023',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  searchSection: {
    padding: wp('4%'),
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    marginBottom: hp('1%'),
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
  },
  searchInput: {
    flex: 1,
    height: hp('5%'),
    fontSize: wp('3.5%'),
  },
  searchButton: {
    backgroundColor: '#e60023',
    padding: wp('2%'),
    borderRadius: wp('1.5%'),
  },
  orderDetails: {
    flex: 1,
    padding: wp('4%'),
  },
  statusSection: {
    marginBottom: hp('2%'),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    gap: wp('2%'),
  },
  statusText: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  orderInfo: {
    backgroundColor: '#fff',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  infoLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  infoValue: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    color: '#333',
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
    alignItems: 'center',
  },
  itemImageContainer: {
    width: wp('15%'),
    height: wp('15%'),
    backgroundColor: '#f0f0f0',
    borderRadius: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginBottom: hp('0.5%'),
  },
  itemQuantity: {
    fontSize: wp('3%'),
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  itemPrice: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#e60023',
  },
  addressContainer: {
    backgroundColor: '#fff',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  addressText: {
    fontSize: wp('3.5%'),
    lineHeight: wp('5%'),
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('10%'),
  },
  emptyText: {
    fontSize: wp('4%'),
    color: '#666',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default TrackOrder;
