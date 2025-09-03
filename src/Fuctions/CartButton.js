import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartButton = ({ productId, onQuantityChange, style, textStyle }) => {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuantity();
  }, [productId]);

  const loadQuantity = async () => {
    try {
      const cartItems = await AsyncStorage.getItem('cartItems');
      if (cartItems) {
        const items = JSON.parse(cartItems);
        const item = items.find(item => item.id === productId);
        setQuantity(item ? item.quantity : 0);
      }
    } catch (error) {
      console.error('Error loading quantity:', error);
    }
  };

  const updateCart = async (newQuantity) => {
    try {
      const cartItems = await AsyncStorage.getItem('cartItems');
      let items = cartItems ? JSON.parse(cartItems) : [];
      
      const existingItemIndex = items.findIndex(item => item.id === productId);
      
      if (newQuantity === 0) {
        // Remove item from cart
        items = items.filter(item => item.id !== productId);
      } else if (existingItemIndex >= 0) {
        // Update existing item
        items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item (this shouldn't happen with this component)
        console.warn('Trying to add new item with CartButton');
      }
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
      setQuantity(newQuantity);
      
      if (onQuantityChange) {
        onQuantityChange(newQuantity);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const handleIncrease = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await updateCart(quantity + 1);
    } catch (error) {
      console.error('Error increasing quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await updateCart(quantity - 1);
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (quantity === 0) {
    return (
      <TouchableOpacity
        style={[styles.addButton, style]}
        onPress={handleIncrease}
        disabled={loading}
      >
        <Text style={[styles.addButtonText, textStyle]}>Add</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.quantityContainer, style]}>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={handleDecrease}
        disabled={loading}
      >
        <Icon name="remove" size={wp('4%')} color="#007AFF" />
      </TouchableOpacity>
      
      <Text style={[styles.quantityText, textStyle]}>{quantity}</Text>
      
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={handleIncrease}
        disabled={loading}
      >
        <Icon name="add" size={wp('4%')} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('3.5%'),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1%'),
  },
  quantityButton: {
    padding: wp('1%'),
    borderRadius: wp('1%'),
  },
  quantityText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: wp('2%'),
    minWidth: wp('6%'),
    textAlign: 'center',
  },
});

export default CartButton;
