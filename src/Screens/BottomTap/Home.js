import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import SimpleDrawer from '../../Navigation/SimpleDrawer';
import { HOMEPAGE_ENDPOINT, API_ACCESS_KEY } from '../../config/config';
import {
  updateCartItem,
  getProductQuantity,
  fetchCartItems,
} from '../../Fuctions/CartService';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState({}); // Track cart items and their quantities
  const [drawerVisible, setDrawerVisible] = useState(false);
  const promotion = data?.section;

  // Load cart data when component mounts
  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      const cartItems = await fetchCartItems();
      const cartState = {};
      cartItems.forEach(item => {
        const itemId = item.id || item.product_id;
        cartState[itemId] = item.quantity || 0;
      });
      setCartItems(cartState);
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  };

  // Cart functions
  const addToCart = async item => {
    try {
      const currentQuantity = await getProductQuantity(
        item.id || item.product_id,
      );
      await updateCartItem(item, currentQuantity + 1);
      // Update local state to reflect the change
      setCartItems(prev => ({
        ...prev,
        [item.id || item.product_id]: currentQuantity + 1,
      }));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async item => {
    try {
      const currentQuantity = await getProductQuantity(
        item.id || item.product_id,
      );
      if (currentQuantity > 1) {
        await updateCartItem(item, currentQuantity - 1);
        setCartItems(prev => ({
          ...prev,
          [item.id || item.product_id]: currentQuantity - 1,
        }));
      } else {
        // If quantity is 1, keep it at 1 (don't allow going to 0)
        setCartItems(prev => ({
          ...prev,
          [item.id || item.product_id]: 1,
        }));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const getItemQuantity = async item => {
    try {
      const quantity = await getProductQuantity(item.id || item.product_id);
      return quantity;
    } catch (error) {
      console.error('Error getting item quantity:', error);
      return 0;
    }
  };

  // Cart Button Component
  const CartButton = ({ item }) => {
    const quantity = cartItems[item.id || item.product_id] || 0;

    if (quantity === 0) {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: '#EF3340',
            paddingVertical: hp('0.9%'),
            paddingHorizontal: wp('6%'),
            borderRadius: wp('1%'),
            alignItems: 'center',
            marginTop: hp('1%'),
            //marginBottom: hp('1%'),
            marginHorizontal: wp('3%'),
            height: hp('4%'),
            width: wp('80%'),
            alignSelf: 'center',
            marginBottom: hp('1%'),
          }}
          onPress={() => addToCart(item)}
          activeOpacity={1}
        >
          <Text
            style={{ color: '#fff', fontWeight: 'bold', fontSize: wp('3.5%') }}
          >
            Add to Cart
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp('1%'),
          gap: wp('3%'),
          height: hp('4%'),
          width: wp('80%'),
          alignSelf: 'center',
          marginHorizontal: wp('3%'),
        }}
      >
        <TouchableOpacity
          onPress={() => removeFromCart(item)}
          style={{
            width: wp('8%'),
            height: wp('8%'),
            backgroundColor: '#EF3340',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp('1%'),
          }}
          activeOpacity={1}
        >
          <View
            style={{
              width: wp('4%'),
              height: wp('0.4%'),
              backgroundColor: '#fff',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: '#333',
            fontWeight: 'bold',
            fontSize: wp('3%'),
            minWidth: wp('6%'),
            textAlign: 'center',
          }}
        >
          {quantity}
        </Text>

        <TouchableOpacity
          onPress={() => addToCart(item)}
          style={{
            width: wp('8%'),
            height: wp('8%'),
            backgroundColor: '#EF3340',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp('1%'),
          }}
          activeOpacity={1}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                width: wp('4%'),
                height: wp('0.4%'),
                backgroundColor: '#fff',
                position: 'absolute',
              }}
            />
            <View
              style={{
                width: wp('0.4%'),
                height: wp('4%'),
                backgroundColor: '#fff',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const fetchHomePageData = async () => {
    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      const response = await axios.post(HOMEPAGE_ENDPOINT, formData);
      if (response.data && response.data.error === 'false') {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const res = await fetchHomePageData();
    if (res) {
      setData(res);
      setCategories(res.category || []);
      const prod =
        res.section?.[0]?.products?.map(p => ({
          name: p.name,
          size: p.variants?.[0]?.measurement_unit_name || '',
          price: `₹${p.variants?.[0]?.product_price || ''}`,
          image: { uri: p.image },
        })) || [];
      setProducts(prod);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchHomePageData();
      if (res) {
        setData(res);
        setCategories(res.category || []);
        const prod =
          res.section?.[0]?.products?.map(p => ({
            name: p.name,
            size: p.variants?.[0]?.measurement_unit_name || '',
            price: `₹${p.variants?.[0]?.product_price || ''}`,
            image: { uri: p.image },
          })) || [];
        setProducts(prod);
      }
    };
    loadData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', gap: wp('3.5%') }}>
            <TouchableOpacity
              onPress={() => {
                console.log('Menu button pressed - opening drawer');
                setDrawerVisible(true);
              }}
              activeOpacity={1}
            >
              <Icon name="menu" size={wp('6%')} color="#fff" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: wp('2.5%'),
            }}
          >
            <Image
              source={require('../../Assets/Images/Edit.png')}
              style={{ width: wp('4%'), height: hp('2%'), tintColor: '#fff' }}
            />
            <Text style={styles.locationText}>Choose Location </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={1}
          >
            <Icon name="cart-outline" size={wp('6%')} color="#fff" />
          </TouchableOpacity>
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
            />
          </View>
        </View>

        {/* Banner */}
        {data?.slider?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: wp('1.2%') }}
          >
            {data.slider.map((item, index) => (
              <Image
                key={index}
                source={{ uri: item.image }}
                style={styles.banner}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Promotion Section */}
        {data?.section
          ?.filter(item => item.title === 'PROMOTION' && item.place === 'top')
          .map(promo => (
            <View
              key={promo.id}
              style={{
                marginHorizontal: wp('4%'),
                marginVertical: hp('1%'),
                padding: wp('3%'),
                backgroundColor:
                  promo.style === 'style_1' ? '#f9fbfcff' : '#f6f7f7ff',
                borderRadius: wp('2%'),
              }}
            >
              <Text
                style={{
                  fontSize: wp('4%'),
                  fontWeight: '600',
                  marginBottom: hp('0.5%'),
                }}
              >
                {promo.title}
              </Text>
              {promo.products?.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: wp('2%') }}
                >
                  {promo.products.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        navigation.navigate('ProductDetails', { product: item })
                      }
                      activeOpacity={1}
                    >
                      <View
                        style={{
                          width: wp('40%'),
                          marginRight: wp('3%'),
                          backgroundColor: '#edececff',
                          borderRadius: wp('2%'),
                          overflow: 'hidden',
                          elevation: 2,
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            width: '100%',
                            height: hp('20%'),
                            resizeMode: 'cover',
                          }}
                        />
                        <Text
                          style={{ padding: wp('2%'), fontWeight: '500' }}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: wp('2%'),
                            marginBottom: hp('0.5%'),
                          }}
                        >
                          <Text
                            style={{
                              color: '#888',
                              fontSize: wp('3%'),
                              flex: 1,
                            }}
                          >
                            1 Pc
                          </Text>
                          <Text
                            style={{
                              color: 'green',
                              fontWeight: 'bold',
                              fontSize: wp('3.5%'),
                              textAlign: 'right',
                            }}
                          >
                            RM{item?.variants?.[0]?.product_price || ''}
                          </Text>
                        </View>
                        <CartButton item={item} />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          ))}

        {/* Category Section */}
        <View>
          <Text style={styles.sectionTitle}>Category</Text>
          {categories?.length > 0 && (
            <FlatList
              data={categories}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
              removeClippedSubviews={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              getItemLayout={null}
              disableVirtualization={true}
              contentContainerStyle={{
                paddingHorizontal: wp('2%'),
                paddingBottom: hp('1.5%'),
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: hp('1.5%'),
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() =>
                    navigation.navigate('SubCategory', {
                      category_id: item.id,
                      subcategory_id:
                        data?.section?.[0]?.products?.[0]?.subcategory_id,
                      category_name: item.name,
                    })
                  }
                  activeOpacity={1}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cardImage}
                    />
                  ) : (
                    <View style={styles.placeholderCircle} />
                  )}
                  <Text style={styles.cardText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* New Arrival Products Section */}
        <View>
          <Text style={styles.sectionTitle}>New arrival products</Text>
          {products?.length > 0 && (
            <FlatList
              data={products}
              numColumns={2}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              removeClippedSubviews={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              windowSize={10}
              getItemLayout={null}
              disableVirtualization={true}
              contentContainerStyle={{
                paddingHorizontal: wp('2%'),
                paddingBottom: hp('1.5%'),
              }}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: hp('1.5%'),
              }}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productSize}>{item.size}</Text>
                  <Text style={styles.productPrice}>
                    {item.price.replace('RM', 'RM')}
                  </Text>
                  <CartButton item={item} />
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
      <SimpleDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e60023',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: wp('3.5%'),
    lineHeight: wp('5.1%'),
    letterSpacing: 0,
  },
  searchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },
  searchContainer: {
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
  },
  searchIcon: {
    marginHorizontal: wp('2%'),
  },
  banner: {
    width: screenWidth - wp('2.5%'),
    height: hp('25%'),
    borderRadius: wp('3.5%'),
    marginHorizontal: wp('1.2%'),
    overflow: 'hidden',
    paddingTop: hp('1%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    marginHorizontal: wp('4%'),
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  cardContainer: {
    width: wp('45%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: wp('1%'),
    alignItems: 'center',
    paddingBottom: hp('1.5%'),
    marginBottom: hp('2%'),
    alignSelf: 'flex-start',
  },
  cardImage: {
    width: '100%',
    height: hp('26%'),
    resizeMode: 'cover',
  },
  placeholderCircle: {
    width: wp('15%'),
    height: wp('15%'),
    backgroundColor: '#ccc',
    borderRadius: wp('7.5%'),
  },
  cardText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: wp('2%'),
    paddingTop: hp('1%'),
  },
  productName: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: wp('2%'),
    paddingTop: hp('1%'),
  },
  productSize: {
    fontSize: wp('3%'),
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: wp('2%'),
  },
  productPrice: {
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    paddingHorizontal: wp('2%'),
    marginTop: hp('0.5%'),
  },
  addButton: {
    backgroundColor: '#e60023',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    marginTop: hp('1%'),
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: wp('3%'),
    width: '100%',
    height: '10%',
  },
});

export default HomeScreen;
