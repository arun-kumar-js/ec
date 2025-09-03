import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishList = () => {
  const navigation = useNavigation();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async itemId => {
    try {
      const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
      await AsyncStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setWishlistItems(updatedWishlist);
      Alert.alert('Success', 'Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      Alert.alert('Error', 'Failed to remove item from wishlist');
    }
  };

  const addToCart = item => {
    // This would integrate with your cart system
    Alert.alert('Success', 'Item added to cart');
  };

  const renderWishlistItem = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name || 'Product Name'}
        </Text>
        <Text style={styles.itemPrice}>₹{item.price || '0'}</Text>
        <Text style={styles.itemSize}>Size: {item.size || 'Standard'}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => addToCart(item)}
        >
          <Icon name="cart" size={wp('4%')} color="#e60023" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeFromWishlist(item.id)}
        >
          <Icon name="trash" size={wp('4%')} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="heart-outline" size={wp('20%')} color="#ccc" />
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptyText}>
        Start adding products to your wishlist to save them for later
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading wishlist...</Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderWishlistItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />
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
  listContainer: {
    flexGrow: 1,
    padding: wp('4%'),
  },
  wishlistItem: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginBottom: hp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  itemPrice: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#e60023',
    marginBottom: hp('0.5%'),
  },
  itemSize: {
    fontSize: wp('3%'),
    color: '#666',
  },
  itemActions: {
    flexDirection: 'column',
    gap: hp('1%'),
  },
  actionButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('10%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  emptyText: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  browseButton: {
    backgroundColor: '#e60023',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('2%'),
  },
  browseButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
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
});

export default WishList;
