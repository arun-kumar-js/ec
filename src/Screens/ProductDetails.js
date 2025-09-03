import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartButton from '../Fuctions/CartButton';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params || {};
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    checkWishlistStatus();
  }, [product]);

  const checkWishlistStatus = async () => {
    try {
      const wishlistItems = await AsyncStorage.getItem('wishlistItems');
      if (wishlistItems) {
        const items = JSON.parse(wishlistItems);
        setIsInWishlist(items.some(item => item.id === product?.id));
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const addToWishlist = async () => {
    try {
      const wishlistItems = await AsyncStorage.getItem('wishlistItems');
      let items = wishlistItems ? JSON.parse(wishlistItems) : [];
      
      if (isInWishlist) {
        items = items.filter(item => item.id !== product.id);
        setIsInWishlist(false);
        Alert.alert('Success', 'Removed from wishlist');
      } else {
        items.push(product);
        setIsInWishlist(true);
        Alert.alert('Success', 'Added to wishlist');
      }
      
      await AsyncStorage.setItem('wishlistItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      Alert.alert('Error', 'Failed to update wishlist');
    }
  };

  const addToCart = async () => {
    try {
      const cartItems = await AsyncStorage.getItem('cartItems');
      let items = cartItems ? JSON.parse(cartItems) : [];
      
      const existingItem = items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        items.push({ ...product, quantity });
      }
      
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
      Alert.alert('Success', 'Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add to cart');
    }
  };

  const renderImageSlider = () => {
    const images = product?.images || [product?.image];
    
    return (
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentImageIndex(index);
          }}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
        
        {/* Image Indicators */}
        <View style={styles.imageIndicators}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentImageIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp('6%')} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: wp('6%') }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
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
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity onPress={addToWishlist}>
          <Icon
            name={isInWishlist ? 'heart' : 'heart-outline'}
            size={wp('6%')}
            color={isInWishlist ? '#ff4444' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderImageSlider()}

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>₹{product.price}</Text>
          
          {product.description && (
            <Text style={styles.productDescription}>{product.description}</Text>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <CartButton
              productId={product.id}
              onQuantityChange={setQuantity}
              style={styles.quantityButton}
              textStyle={styles.quantityText}
            />
          </View>

          {/* Product Details */}
          {product.category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
          )}

          {product.brand && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Brand:</Text>
              <Text style={styles.detailValue}>{product.brand}</Text>
            </View>
          )}

          {product.weight && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Weight:</Text>
              <Text style={styles.detailValue}>{product.weight}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={addToCart}
        >
          <Icon name="cart-outline" size={wp('5%')} color="#fff" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buyNowButton}
          onPress={() => {
            addToCart();
            navigation.navigate('CheckOut');
          }}
        >
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: wp('4%'),
    color: '#666',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: width,
    height: hp('40%'),
  },
  imageIndicators: {
    position: 'absolute',
    bottom: hp('2%'),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: wp('1%'),
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  productInfo: {
    padding: wp('4%'),
  },
  productName: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  productPrice: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: hp('2%'),
  },
  productDescription: {
    fontSize: wp('3.5%'),
    color: '#666',
    lineHeight: wp('5%'),
    marginBottom: hp('3%'),
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  quantityLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginRight: wp('3%'),
  },
  quantityButton: {
    flex: 1,
  },
  quantityText: {
    fontSize: wp('3.5%'),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: wp('3.5%'),
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: wp('3.5%'),
    color: '#333',
    fontWeight: '600',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: wp('4%'),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
    marginRight: wp('2%'),
  },
  addToCartText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
  buyNowButton: {
    flex: 1,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
    marginLeft: wp('2%'),
  },
  buyNowText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;
