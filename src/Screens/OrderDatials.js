import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const OrderDetails = ({ route }) => {
  const { orderData } = route.params || {};
  const [order, setOrder] = useState(orderData || {});

  useEffect(() => {
    console.log('Order Data:', order);
  }, [order]);

  return (
    <ScrollView style={styles.container}>
      {/* Product Info */}
      <View style={styles.section}>
        <Image source={{ uri: order.image }} style={styles.productImage} />
        <Text style={styles.productName}>{order.name}</Text>
        <Text>Quantity: {order.quantity}</Text>
        <Text>Unit: {order.unit}</Text>
        <Text>Price: ₹{order.price}</Text>
        <Text>Discounted Price: ₹{order.discounted_price}</Text>
        <Text>Sub Total: ₹{order.sub_total}</Text>
      </View>

      {/* Order Info */}
      <View style={styles.section}>
        <Text>Order ID: {order.order_id}</Text>
        <Text>Date Added: {order.date_added}</Text>
        <Text>Active Status: {order.active_status}</Text>
      </View>

      {/* Status Timeline */}
      <View style={styles.section}>
        <Text>Order Status:</Text>
        {order.status?.map((s, index) => (
          <Text key={index}>
            {s[0]} - {s[1]}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  productImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10 },
  productName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
});

export default OrderDetails;
