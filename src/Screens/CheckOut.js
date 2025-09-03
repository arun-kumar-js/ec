import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CheckOutScreen = ({ route }) => {
  const navigation = useNavigation();
  const [promoCode, setPromoCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);

  // Get selected address from route params
  const selectedAddress = route.params?.selectedAddress || {
    name: 'Veeramani',
    address: 'No 23, 5th street, little mount, Saidapet, Chennai - 600015',
    mobile: '9176123456',
    email: 'veeramani23@gmail.com',
  };

  const orderItems = [
    {
      id: 1,
      name: 'Neem & Turmeric Soap',
      qty: 1,
      price: 3.0,
      subtotal: 3.0,
      cg: 0.2,
    },
  ];

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = orderItems.reduce((sum, item) => sum + item.cg, 0);
    const taxableAmount = subtotal - tax;
    const deliveryCharge = 0.0;
    const total = subtotal + deliveryCharge;

    return {
      taxableAmount,
      tax,
      subtotal,
      deliveryCharge,
      total,
    };
  };

  const totals = calculateTotals();

  const deliveryOptions = [
    { id: 'standard', name: 'Standard Delivery (2-3 days)', price: 0 },
    { id: 'express', name: 'Express Delivery (1 day)', price: 50 },
    { id: 'same_day', name: 'Same Day Delivery', price: 100 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#EF3340" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressDot, styles.activeDot]}>
            <Icon name="checkmark" size={16} color="white" />
          </View>
          <Text style={[styles.progressText, styles.activeProgressText]}>
            Delivery
          </Text>
        </View>
        <View style={styles.progressArrow}>
          <Icon name="chevron-forward" size={20} color="#EF3340" />
        </View>
        <View style={styles.progressStep}>
          <View style={styles.progressDot}>
            <Text style={styles.progressNumber}>2</Text>
          </View>
          <Text style={styles.progressText}>Payment</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddressPage')}
            >
              <Icon name="create-outline" size={20} color="#EF3340" />
            </TouchableOpacity>
          </View>
          <View style={styles.addressContent}>
            <Text style={styles.addressName}>{selectedAddress.name}</Text>
            <Text style={styles.addressText}>{selectedAddress.address}</Text>
            <Text style={styles.addressText}>
              Mobile: {selectedAddress.mobile}
            </Text>
            <Text style={styles.addressText}>
              Email: {selectedAddress.email}
            </Text>
          </View>
        </View>

        {/* Promo Code Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Have a Promo Code?</Text>
            <TouchableOpacity>
              <Icon name="refresh-outline" size={20} color="#EF3340" />
            </TouchableOpacity>
          </View>
          <View style={styles.promoContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Promo Code"
              placeholderTextColor="#999"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Method Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Method</Text>
          <TouchableOpacity
            style={styles.deliverySelector}
            onPress={() => setShowDeliveryOptions(!showDeliveryOptions)}
          >
            <Text
              style={
                deliveryMethod ? styles.deliveryText : styles.placeholderText
              }
            >
              {deliveryMethod || 'Select Delivery Method'}
            </Text>
            <Icon name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>

          {showDeliveryOptions && (
            <View style={styles.deliveryOptions}>
              {deliveryOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.deliveryOption}
                  onPress={() => {
                    setDeliveryMethod(option.name);
                    setShowDeliveryOptions(false);
                  }}
                >
                  <Text style={styles.deliveryOptionText}>{option.name}</Text>
                  <Text style={styles.deliveryOptionPrice}>
                    {option.price > 0 ? `₹${option.price}` : 'Free'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Order Summary Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Product Name</Text>
            <Text style={styles.tableHeaderText}>Qty</Text>
            <Text style={styles.tableHeaderText}>Price</Text>
            <Text style={styles.tableHeaderText}>Subtotal</Text>
            <Text style={styles.tableHeaderText}>CG</Text>
          </View>

          {/* Table Rows */}
          {orderItems.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.qty}</Text>
              <Text style={styles.tableCell}>₹{item.price.toFixed(2)}</Text>
              <Text style={styles.tableCell}>₹{item.subtotal.toFixed(2)}</Text>
              <Text style={styles.tableCell}>₹{item.cg.toFixed(2)}</Text>
            </View>
          ))}

          {/* Summary Breakdown */}
          <View style={styles.summaryBreakdown}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxable Amount</Text>
              <Text style={styles.summaryValue}>
                ₹{totals.taxableAmount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                + ₹{totals.tax.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ₹{totals.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charge</Text>
              <Text style={styles.summaryValue}>
                ₹{totals.deliveryCharge.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          <Icon name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.totalText}>
            Total : ₹{totals.total.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
          <Icon name="chevron-forward" size={20} color="white" />
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
    backgroundColor: '#EF3340',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeDot: {
    backgroundColor: '#EF3340',
  },
  progressNumber: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  activeProgressText: {
    color: '#EF3340',
    fontWeight: 'bold',
  },
  progressArrow: {
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF3340',
  },
  addressContent: {
    gap: 4,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  promoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: '#EF3340',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deliverySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  deliveryText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
  deliveryOptions: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  deliveryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deliveryOptionText: {
    fontSize: 14,
    color: '#333',
  },
  deliveryOptionPrice: {
    fontSize: 14,
    color: '#EF3340',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  summaryBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  bottomBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#EF3340',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckOutScreen;
