import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Image, StatusBar, Alert } from 'react-native';
import { API_BASE_URL } from '../config/config';

const OrderDatials = ({ route, navigation }) => {
  // Get data from navigation params
  const { orderData: paramsOrderData } = route.params || {};
  
  // Default fallback data
  const defaultOrderData = {
    active_status: "received",
    date_added: "2025-09-03 20:53:06",
    discount: "0",
    discounted_price: "20",
    id: "582",
    image: "https://spiderekart.in/ec_service/upload/images/5452-2025-07-15.jpg",
    measurement: "400",
    name: "Neem & Turmeric Soap",
    order_id: "247",
    price: "3.0",
    product_id: "43",
    product_variant_id: "43",
    quantity: "1",
    rating: "0",
    rating_desc: "",
    sub_total: "2.54",
    unit: "gm",
    user_id: "1",
    status: [["received", "04-09-2025 08:53:05am"]],
    // Additional fields from the reference image
    order_date: "23-01-2024",
    customer_details: {
      name: "Veeramani",
      mobile: "9629045353",
      address: "No 5, 13th Street, Little Mount, Saidapet, Chennai - 600015",
      email: "Veeramani23@gmail.com",
    },
    delivery_time: "Today/Afternoon 2PM - 7PM",
    items_amount: "2.54",
    delivery_charge: "0.0",
    tax: "0.46",
    total: "2.54",
    grand_total: "163.00"
  };

  // Use params data or fallback to default data
  const [orderData, setOrderData] = useState(paramsOrderData || defaultOrderData);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isCancelling, setIsCancelling] = useState(false);

  // Update orderData when params change
  useEffect(() => {
    if (paramsOrderData) {
      const mergedData = mergeOrderData(paramsOrderData, defaultOrderData);
      setOrderData(mergedData);
    }
  }, [paramsOrderData]);

  // Helper function to merge params data with defaults
  const mergeOrderData = (paramsData, defaultData) => {
    if (!paramsData) return defaultData;
    
    return {
      ...defaultData,
      ...paramsData,
      // Ensure customer_details is properly merged
      customer_details: {
        ...defaultData.customer_details,
        ...(paramsData.customer_details || {})
      }
    };
  };

  // Cancel Order API Function
  const cancelOrder = async () => {
    try {
      setIsCancelling(true);
      
      const formData = new FormData();
      formData.append('accesskey', '90336');
      formData.append('update_order_status', '1');
      formData.append('status', 'cancelled');
      formData.append('id', orderData.order_id || orderData.id);

      console.log('Cancelling order with data:', {
        accesskey: '90336',
        update_order_status: '1',
        status: 'cancelled',
        id: orderData.order_id || orderData.id
      });

      const response = await fetch(`${API_BASE_URL}order-process.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Cancel order API response:', result);

      if (result.error === false) {
        Alert.alert(
          'Success',
          'Order has been cancelled successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                // Update local state
                setOrderData(prev => ({
                  ...prev,
                  active_status: 'Cancelled'
                }));
                // Navigate back or refresh
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          result.message || 'Failed to cancel order. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      Alert.alert(
        'Error',
        'Network error. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCancelling(false);
    }
  };

  // Debug: Log the received params
  useEffect(() => {
    console.log('=== ORDER DETAILS PARAMS DEBUG ===');
    console.log('Route params:', route.params);
    console.log('Params orderData:', paramsOrderData);
    console.log('Current orderData state:', orderData);
    console.log('Has params orderData:', !!paramsOrderData);
    console.log('Order ID from params:', paramsOrderData?.order_id);
    console.log('Customer name from params:', paramsOrderData?.customer_details?.name);
    console.log('===================================');
  }, [route.params, orderData, paramsOrderData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc3545" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track order</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer}>
      

        {/* Order Header */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Ordered ID:</Text>
            <Text style={styles.value}>{orderData.order_id || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>{orderData.order_date || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Product Details */}
        <View style={styles.section}>
          <View style={styles.productContainer}>
            {orderData.image && (
              <Image source={{ uri: orderData.image }} style={styles.productImage} />
            )}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{orderData.name || 'Product Name'}</Text>
              <Text style={styles.quantity}>Qty. {orderData.quantity || '1'}</Text>
              <Text style={styles.price}>₹{orderData.price || '0'}</Text>
              <Text style={styles.measurement}>{orderData.measurement || '1'} {orderData.unit || 'unit'}</Text>
            </View>
            {orderData.active_status !== 'Cancelled' && (
              <TouchableOpacity style={styles.returnButton}>
                <Text style={styles.returnButtonText}>Cancel item</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      

        {/* Price Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Items Amount:</Text>
            <Text style={styles.value}>₹{orderData.items_amount || orderData.sub_total || '0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Charge:</Text>
            <Text style={styles.value}>₹{orderData.delivery_charge || '0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax:</Text>
            <Text style={styles.value}>+ ₹{orderData.tax || '0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.value}>₹{orderData.total || orderData.sub_total || '0'}</Text>
          </View>
          <View style={[styles.row, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalValue}>₹{orderData.grand_total || orderData.sub_total || '0'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{orderData.customer_details?.name || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile No:</Text>
              <Text style={styles.detailValue}>{orderData.customer_details?.mobile || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>{orderData.customer_details?.address || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gmail:</Text>
              <Text style={styles.detailValue}>{orderData.customer_details?.email || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Time :</Text>
              <Text style={styles.detailValue}>{orderData.delivery_time || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Order Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          <View style={styles.statusProgressContainer}>
            <View style={styles.statusItem}>
              <View style={[styles.statusCircle, 
                ['received', 'Processing', 'Confirmed', 'Order Placed'].includes(orderData.active_status) ? styles.activeStatusCircle : styles.inactiveStatusCircle]} />
              <Text style={styles.statusLabel}>Order Placed</Text>
              {['received', 'Processing', 'Confirmed', 'Order Placed'].includes(orderData.active_status) && (
                <Text style={styles.statusDate}>{orderData.date_added || orderData.order_date || 'N/A'}</Text>
              )}
            </View>
            
            <View style={styles.statusConnector} />
            
            <View style={styles.statusItem}>
              <View style={[styles.statusCircle, 
                ['In Transit', 'Shipped', 'Order Processed'].includes(orderData.active_status) ? styles.activeStatusCircle : styles.inactiveStatusCircle]} />
              <Text style={styles.statusLabel}>Order Processed</Text>
              {['In Transit', 'Shipped', 'Order Processed'].includes(orderData.active_status) && (
                <Text style={styles.statusDate}>{orderData.date_added || orderData.order_date || 'N/A'}</Text>
              )}
            </View>
            
            <View style={styles.statusConnector} />
            
            <View style={styles.statusItem}>
              <View style={[styles.statusCircle, 
                ['Order Shipped'].includes(orderData.active_status) ? styles.activeStatusCircle : styles.inactiveStatusCircle]} />
              <Text style={styles.statusLabel}>Order Shipped</Text>
              {['Order Shipped'].includes(orderData.active_status) && (
                <Text style={styles.statusDate}>{orderData.date_added || orderData.order_date || 'N/A'}</Text>
              )}
            </View>
            
            <View style={styles.statusConnector} />
            
            <View style={styles.statusItem}>
              <View style={[styles.statusCircle, 
                ['Delivered', 'Order Delivered'].includes(orderData.active_status) ? styles.activeStatusCircle : 
                orderData.active_status === 'Cancelled' ? styles.cancelledStatusCircle : styles.inactiveStatusCircle]} />
              <Text style={styles.statusLabel}>
                {orderData.active_status === 'Cancelled' ? 'Product Cancelled' : 'Order Delivered'}
              </Text>
              {(['Delivered', 'Order Delivered'].includes(orderData.active_status) || orderData.active_status === 'Cancelled') && (
                <Text style={styles.statusDate}>{orderData.date_added || orderData.order_date || 'N/A'}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Cancel/Review Button at Bottom */}
      <View style={styles.bottomButtonContainer}>
        {orderData.active_status === 'Delivered' ? (
          <TouchableOpacity 
            style={styles.reviewOrderButton}
            onPress={() => {
              console.log('Navigating to Rating page with data:', orderData);
              navigation.navigate('Rating', {
                orderData: orderData
              });
            }}
          >
            <Text style={styles.reviewOrderButtonText}>REVIEW</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.cancelOrderButton, isCancelling && styles.cancelOrderButtonDisabled]}
            onPress={() => {
              Alert.alert(
                'Cancel Order',
                'Are you sure you want to cancel this order?',
                [
                  {
                    text: 'No',
                    style: 'cancel'
                  },
                  {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: cancelOrder
                  }
                ]
              );
            }}
            disabled={isCancelling || orderData.active_status === 'Cancelled'}
          >
            <Text style={styles.cancelOrderButtonText}>
              {isCancelling ? 'CANCELLING...' : 
               orderData.active_status === 'Cancelled' ? 'ORDER CANCELLED' : 
               'CANCEL ORDER?'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#dc3545',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  headerSpacer: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  debugSection: {
    backgroundColor: '#fff3cd',
    padding: 12,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
    fontFamily: 'Montserrat-Regular',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Montserrat-SemiBold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Montserrat-Medium',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
    flex: 0.4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Montserrat-Medium',
    flex: 0.6,
    textAlign: 'right',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
    fontFamily: 'Montserrat-Regular',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 2,
    fontFamily: 'Montserrat-Bold',
  },
  measurement: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  returnButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  returnButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  bottomButtonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelOrderButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  cancelOrderButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  reviewOrderButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewOrderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 12,
  },
  starButton: {
    marginRight: 8,
  },
  star: {
    fontSize: 24,
    fontFamily: 'Montserrat-Regular',
  },
  starFilled: {
    color: '#ffc107',
  },
  starEmpty: {
    color: '#ddd',
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  reviewInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    textAlignVertical: 'top',
    minHeight: 80,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  submitButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  statusContainer: {
    marginTop: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  horizontalStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
  },
  horizontalStatusItem: {
    alignItems: 'center',
    flex: 1,
  },
  horizontalStatusText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontFamily: 'Montserrat-Regular',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  activeStatus: {
    backgroundColor: '#28a745',
  },
  inactiveStatus: {
    backgroundColor: '#ddd',
  },
  cancelledStatus: {
    backgroundColor: '#dc3545',
  },
  statusInfoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  currentStatusText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  statusValue: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  statusDateText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  statusDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  statusProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 8,
  },
  activeStatusCircle: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  inactiveStatusCircle: {
    backgroundColor: 'transparent',
    borderColor: '#ddd',
  },
  cancelledStatusCircle: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },
  statusLabel: {
    fontSize: 10,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Montserrat-Regular',
  },
  statusConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
    marginTop: -10,
  },
});

export default OrderDatials;