import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { API_ACCESS_KEY, API_BASE_URL } from '../config/config';
import { getProductQuantity, increaseProductQuantity, decreaseProductQuantity } from '../Fuctions/CartService';

const Search = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState({});

  // Load cart data when component mounts
  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      const cartItems = await getProductQuantity();
      setCartItems(cartItems);
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', 'products-search');
      formData.append('accesskey', API_ACCESS_KEY);
      formData.append('search', query.trim());

      const response = await fetch(`${API_BASE_URL}products-search.php`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        setSearchResults(result.data);
      } else {
        setSearchResults([]);
        Alert.alert('No Results', 'No products found for your search.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search products. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchProducts(searchQuery);
  };

  const addToCart = async (item) => {
    try {
      const newQuantity = await increaseProductQuantity(item);
      setCartItems(prev => ({
        ...prev,
        [item.id || item.product_id]: newQuantity,
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (item) => {
    try {
      const newQuantity = await decreaseProductQuantity(item);
      setCartItems(prev => ({
        ...prev,
        [item.id || item.product_id]: newQuantity,
      }));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const CartButton = ({ item }) => {
    const quantity = cartItems[item.id || item.product_id] || 0;

    if (quantity === 0) {
      return (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
          activeOpacity={1}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => removeFromCart(item)}
          style={styles.quantityButton}
          activeOpacity={1}
        >
          <View style={styles.minusIcon} />
        </TouchableOpacity>

        <Text style={styles.quantityText}>{quantity}</Text>

        <TouchableOpacity
          onPress={() => addToCart(item)}
          style={styles.quantityButton}
          activeOpacity={1}
        >
          <View style={styles.plusIcon}>
            <View style={styles.plusVertical} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
      activeOpacity={1}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          ₹{item?.variants?.[0]?.product_price || '0'}
        </Text>
        <CartButton item={item} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#F70D24" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={wp('6%')} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Products</Text>
        <View style={{ width: wp('9%') }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={wp('5%')}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products.."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              style={styles.clearButton}
            >
              <Icon name="clear" size={wp('5%')} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F70D24" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item, index) => `${item.id || item.product_id || index}`}
          numColumns={2}
          contentContainerStyle={styles.resultsContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : searchQuery.length > 0 ? (
        <View style={styles.noResultsContainer}>
          <Icon name="search-off" size={wp('15%')} color="#ccc" />
          <Text style={styles.noResultsText}>No products found</Text>
          <Text style={styles.noResultsSubtext}>
            Try searching with different keywords
          </Text>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Icon name="search" size={wp('15%')} color="#ccc" />
          <Text style={styles.placeholderText}>Search for products</Text>
          <Text style={styles.placeholderSubtext}>
            Enter a product name to get started
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
    backgroundColor: '#F70D24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  backButton: {
    width: wp('9%'),
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  searchWrapper: {
    backgroundColor: '#F70D24',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: hp('5%'),
    fontSize: wp('3.5%'),
    fontFamily: 'Montserrat-Regular',
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  clearButton: {
    marginLeft: wp('2%'),
  },
  searchButton: {
    backgroundColor: '#F70D24',
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('3.5%'),
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
  resultsContainer: {
    padding: wp('2%'),
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    margin: wp('1%'),
    borderRadius: wp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: hp('20%'),
    resizeMode: 'cover',
  },
  productInfo: {
    padding: wp('3%'),
  },
  productName: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    marginBottom: hp('0.5%'),
    fontFamily: 'Montserrat-SemiBold',
  },
  productPrice: {
    fontSize: wp('3.5%'),
    color: '#F70D24',
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    fontFamily: 'Montserrat-Bold',
  },
  addButton: {
    backgroundColor: '#F70D24',
    paddingVertical: hp('1%'),
    borderRadius: wp('1%'),
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: wp('3%'),
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('3%'),
  },
  quantityButton: {
    width: wp('8%'),
    height: wp('8%'),
    backgroundColor: '#F70D24',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp('1%'),
  },
  minusIcon: {
    width: wp('4%'),
    height: wp('0.5%'),
    backgroundColor: 'white',
  },
  plusIcon: {
    width: wp('4%'),
    height: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusVertical: {
    width: wp('0.5%'),
    height: wp('4%'),
    backgroundColor: 'white',
    position: 'absolute',
  },
  quantityText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp('3%'),
    minWidth: wp('6%'),
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  noResultsText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#666',
    marginTop: hp('2%'),
    fontFamily: 'Montserrat-Bold',
  },
  noResultsSubtext: {
    fontSize: wp('3%'),
    color: '#999',
    textAlign: 'center',
    marginTop: hp('1%'),
    fontFamily: 'Montserrat-Regular',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  placeholderText: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#666',
    marginTop: hp('2%'),
    fontFamily: 'Montserrat-Bold',
  },
  placeholderSubtext: {
    fontSize: wp('3%'),
    color: '#999',
    textAlign: 'center',
    marginTop: hp('1%'),
    fontFamily: 'Montserrat-Regular',
  },
});

export default Search;
