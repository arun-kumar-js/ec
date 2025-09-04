import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserOrders } from '../Fuctions/OrderService';
import { API_BASE_URL } from '../config/config';

const MyOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterTabs = ['All', 'In-Process', 'Shipped', 'Delivered', 'Cancelled'];

  const fetchUserOrders = async () => {
    try {
      setLoading(true);

      // Get user data from AsyncStorage
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);

        const userId = userObj.user_id || userObj.id;
        console.log('Fetching orders for user ID:', userId);

        if (userId) {
          const result = await getUserOrders(userId);
          console.log('Orders API result:', result);

          if (result.success) {
            // Flatten orders into individual product items
            const allProductItems = [];

            result.orders.forEach(order => {
              console.log('=== ORDER DATA ===');
              console.log('Order:', order);

              // API uses 'items' array instead of 'products'
              if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                  console.log('=== ITEM DATA ===');
                  console.log('Item:', item);
                  console.log('Item Image:', item.image);
                  allProductItems.push({
                    orderId: order.id,
                    orderDate:
                      order.date_added ||
                      new Date().toISOString().split('T')[0],
                    orderStatus: getOrderStatus(
                      order.active_status || order.status || 'received',
                    ),
                    productId: item.product_id || item.id,
                    productName: item.name || 'Unknown Product',
                    productImage: item.image || null,
                    quantity: parseInt(item.quantity || 1),
                    variant: `${item.measurement || ''} ${
                      item.unit || ''
                    }`.trim(),
                    price: parseFloat(item.discounted_price || item.price || 0),
                    orderTotal: parseFloat(
                      order.final_total || order.total || 0,
                    ),
                    paymentMethod: order.payment_method || 'N/A',
                    deliveryMethod: order.delivery_method || 'Standard',
                    address: order.address || 'N/A',
                    mobile: order.mobile || 'N/A',
                    deliveryTime: order.delivery_time || 'N/A',
                    rawOrderData: order,
                    rawItemData: item,
                  });
                });
              } else {
                // If no products array, create a single item for the order
                allProductItems.push({
                  orderId: order.id,
                  orderDate:
                    order.date_added || new Date().toISOString().split('T')[0],
                  orderStatus: getOrderStatus(
                    order.order_status || order.status,
                  ),
                  productId: 'general',
                  productName: 'Order Items',
                  productImage: null,
                  quantity: parseInt(order.total_items || 1),
                  variant: '',
                  price: parseFloat(order.final_total || order.total || 0),
                  orderTotal: parseFloat(order.final_total || order.total || 0),
                  paymentMethod: order.payment_method || 'N/A',
                  deliveryMethod: order.delivery_method || 'Standard',
                  address: order.address || 'N/A',
                  mobile: order.mobile || 'N/A',
                  rawOrderData: order,
                  rawProductData: null,
                });
              }
            });

            setOrders(allProductItems);
          } else {
            console.error('Failed to fetch orders:', result.message);
            // For demo purposes, add sample data if API fails
            const sampleOrders = [
              {
                orderId: '247',
                orderDate: '23-01-2024',
                orderStatus: 'Processing',
                productId: 'sample1',
                productName: 'Neem & Turmeric Soap',
                productImage:
                  'https://via.placeholder.com/150x150/FFD700/000000?text=Soap',
                quantity: 1,
                variant: '400 gm',
                price: 25.5,
                orderTotal: 25.5,
                paymentMethod: 'Cash on Delivery',
                deliveryMethod: 'Standard',
                address: 'Sample Address',
                mobile: '1234567890',
              },
              {
                orderId: '247',
                orderDate: '23-01-2024',
                orderStatus: 'Processing',
                productId: 'sample2',
                productName: 'Nature Land Organics',
                productImage:
                  'https://via.placeholder.com/150x150/90EE90/000000?text=Organic',
                quantity: 2,
                variant: '1 pack',
                price: 45.0,
                orderTotal: 90.0,
                paymentMethod: 'Cash on Delivery',
                deliveryMethod: 'Standard',
                address: 'Sample Address',
                mobile: '1234567890',
              },
            ];
            setOrders(sampleOrders);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = statusCode => {
    // Map status codes to readable status based on your API
    switch (statusCode?.toLowerCase()) {
      case 'received':
        return 'Processing';
      case 'confirmed':
      case 'confirm':
        return 'Confirmed';
      case 'shipped':
      case 'out_for_delivery':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
      case 'cancel':
        return 'Cancelled';
      case 'pending':
        return 'Processing';
      default:
        return 'Processing';
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Delivered':
        return '#4CAF50';
      case 'In Transit':
        return '#FF9800';
      case 'Confirmed':
        return '#2196F3';
      case 'Processing':
        return '#FF5722';
      case 'Cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserOrders();
    setRefreshing(false);
  };

  const formatImageUrl = imageUrl => {
    if (!imageUrl) return null;

    // If it's already a complete URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative path, you might need to prepend your base URL
    // Replace 'YOUR_BASE_URL' with your actual image server URL
    if (
      imageUrl.startsWith('/') ||
      imageUrl.startsWith('images/') ||
      imageUrl.startsWith('uploads/')
    ) {
      return `${API_BASE_URL}${
        imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl
      }`;
    }

    return imageUrl;
  };

  const getFilteredOrders = () => {
    if (selectedFilter === 'All') {
      return orders;
    }

    return orders.filter(item => {
      switch (selectedFilter) {
        case 'In-Process':
          return (
            item.orderStatus === 'Processing' ||
            item.orderStatus === 'Confirmed'
          );
        case 'Shipped':
          return item.orderStatus === 'In Transit';
        case 'Delivered':
          return item.orderStatus === 'Delivered';
        case 'Cancelled':
          return item.orderStatus === 'Cancelled';
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const handleViewDetails = item => {
    console.log('Navigating to OrderDatials with data:', item);

    // Navigate to OrderDetails screen with order data
    navigation.navigate('OrderDatials', {
      orderId: item.orderId,
      orderData: {
        // Order information
        id: item.orderId,
        date_added: item.orderDate,
        active_status: item.orderStatus,
        final_total: item.orderTotal,
        payment_method: item.paymentMethod,
        delivery_method: item.deliveryMethod,
        delivery_time: item.deliveryTime,
        address: item.address,
        mobile: item.mobile,

        // Product/Item information
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        variant: item.variant,
        price: item.price,

        // Raw data for additional details
        rawOrderData: item.rawOrderData,
        rawItemData: item.rawItemData,
      },
    });
  };

  const renderFilterTab = tab => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.filterTab,
        selectedFilter === tab && styles.activeFilterTab,
      ]}
      onPress={() => setSelectedFilter(tab)}
    >
      <Text
        style={[
          styles.filterTabText,
          selectedFilter === tab && styles.activeFilterTabText,
        ]}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = item => (
    <View key={`${item.orderId}-${item.productId}`} style={styles.productCard}>
      <View style={styles.productHeader}>
        <Text style={styles.orderId}>Ordered ID: {item.orderId}</Text>
        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() => handleViewDetails(item)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orderDate}>Order Date: {item.orderDate}</Text>
      <View style={styles.dateDivider} />

      <View style={styles.productInfo}>
        <View style={styles.productImageContainer}>
          {formatImageUrl(item.productImage) ? (
            <Image
              source={{ uri: formatImageUrl(item.productImage) }}
              style={styles.productImage}
              resizeMode="contain"
              onError={error => {
                console.log('Image load error:', error.nativeEvent.error);
                console.log(
                  'Failed image URL:',
                  formatImageUrl(item.productImage),
                );
              }}
              onLoad={() => {
                console.log(
                  'Image loaded successfully:',
                  formatImageUrl(item.productImage),
                );
              }}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="image" size={40} color="#ccc" />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productQuantity}>Qty. {item.quantity}</Text>
          {item.variant && (
            <Text style={styles.productVariant}>{item.variant}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const filteredOrders = getFilteredOrders();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My orders</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContainer}
        >
          {filterTabs.map(tab => renderFilterTab(tab))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#EE2737']}
            tintColor="#EE2737"
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EE2737" />
            <Text style={styles.loadingText}>Loading your orders...</Text>
          </View>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(item => renderProductItem(item))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="shopping-bag" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>
              {selectedFilter === 'All'
                ? 'No Orders Yet'
                : `No ${selectedFilter} Orders`}
            </Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'All'
                ? 'Start shopping to see your orders here'
                : `You don't have any ${selectedFilter.toLowerCase()} orders`}
            </Text>
            {selectedFilter === 'All' && (
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    backgroundColor: '#EE2737',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  filterContainer: {
    backgroundColor: '#EE2737',
    paddingBottom: 16,
  },
  filterTabsContainer: {
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFilterTab: {
    backgroundColor: '#fff',
  },
  filterTabText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  activeFilterTabText: {
    color: '#EE2737',
    fontFamily: 'Montserrat-SemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  viewDetailsButton: {
    backgroundColor: '#EE2737',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
  },
  dateDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
    width: '100%',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'Montserrat-Medium',
  },
  productVariant: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Montserrat-Regular',
  },
  shopButton: {
    backgroundColor: '#EE2737',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
});

export default MyOrders;
