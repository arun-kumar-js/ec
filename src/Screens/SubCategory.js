import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { SUB_CATEGORIES_ENDPOINT, API_ACCESS_KEY } from '../config/config';

const SubCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName } = route.params || {};
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  const loadProducts = async () => {
    if (!categoryId) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      formData.append('category_id', categoryId);

      const response = await axios.post(SUB_CATEGORIES_ENDPOINT, formData);
      
      if (response.data && response.data.error === 'false') {
        setProducts(response.data.data || []);
      } else {
        console.error('API error:', response.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price_high':
        return parseFloat(b.price) - parseFloat(a.price);
      default:
        return 0;
    }
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>₹{item.price}</Text>
        <View style={styles.productActions}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => {
              // Add to cart logic
              navigation.navigate('ProductDetails', { product: item });
            }}
          >
            <Icon name="cart-outline" size={wp('4%')} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={() => {
              // Add to wishlist logic
            }}
          >
            <Icon name="heart-outline" size={wp('4%')} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSortOption = (value, label) => (
    <TouchableOpacity
      style={[styles.sortOption, sortBy === value && styles.selectedSortOption]}
      onPress={() => setSortBy(value)}
    >
      <Text style={[styles.sortText, sortBy === value && styles.selectedSortText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp('6%')} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName || 'Products'}</Text>
          <View style={{ width: wp('6%') }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
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
        <Text style={styles.headerTitle}>{categoryName || 'Products'}</Text>
        <TouchableOpacity onPress={() => setFilterVisible(!filterVisible)}>
          <Icon name="filter" size={wp('6%')} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={wp('5%')} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={wp('5%')} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Options */}
      {filterVisible && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortOptions}>
            {renderSortOption('name', 'Name')}
            {renderSortOption('price_low', 'Price: Low to High')}
            {renderSortOption('price_high', 'Price: High to Low')}
          </View>
        </View>
      )}

      {/* Products Count */}
      <View style={styles.productsCount}>
        <Text style={styles.countText}>
          {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Products List */}
      <FlatList
        data={sortedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={wp('15%')} color="#ccc" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp('4%'),
    color: '#666',
    marginTop: hp('2%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginVertical: hp('2%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('4%'),
    color: '#333',
    paddingVertical: hp('1.5%'),
  },
  sortContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sortOption: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    marginRight: wp('2%'),
    marginBottom: hp('1%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  selectedSortOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  sortText: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  selectedSortText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  productsCount: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },
  countText: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  productsList: {
    padding: wp('2%'),
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    margin: wp('1%'),
    padding: wp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: wp('25%'),
    borderRadius: wp('1%'),
    marginBottom: hp('1%'),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
    lineHeight: wp('4.5%'),
  },
  productPrice: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: hp('1%'),
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartButton: {
    padding: wp('2%'),
  },
  wishlistButton: {
    padding: wp('2%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  emptyTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  emptySubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
  },
});

export default SubCategoryScreen;
