import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  ADD_NEW_ADDRESS_STATE,
  ADD_NEW_ADDRESS_CITY,
  ADD_NEW_ADDRESS_AREA,
  API_ACCESS_KEY,
} from '../config/config';

const HEADER_COLOR = '#F40612';
const BACKGROUND_COLOR = '#FFFFFF';
const BORDER_COLOR = '#C5C5C5';
const TEXT_COLOR_DARK = '#333333';
const TEXT_COLOR_MEDIUM = '#555555';
const BORDER_BOTTOM_COLOR = '#EAEAEA';

const DropdownSelector = ({ label, onPress }) => (
  <TouchableOpacity style={styles.dropdownContainer} onPress={onPress}>
    <Text style={styles.dropdownText}>{label}</Text>
    <Icon name="caret-down" size={24} color={TEXT_COLOR_MEDIUM} />
  </TouchableOpacity>
);

const AddAddress = ({ route, navigation }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Get route parameters
  const { editMode = false, addressData = null, user_id = null } = route?.params || {};

  // Form state variables
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    landmark: '',
    pincode: '',
    latitude: '',
    longitude: ''
  });

  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isLocationLoading, setIsLocationLoading] = useState(false);

  useEffect(() => {
    // Fetch all states on mount
    const formData = new FormData();
    formData.append('accesskey', API_ACCESS_KEY);

    axios
      .post(ADD_NEW_ADDRESS_STATE, formData)
      .then(res => {
        console.log('Fetched states:', res.data); // Added console.log for debugging
        setStates(res.data.data || []); // Adjusted to use res.data.data
      })
      .catch(err => console.error('Error fetching states:', err));
  }, []);

  // Populate form data when in edit mode
  useEffect(() => {
    if (editMode && addressData) {
      setFormData({
        name: addressData.name || '',
        mobile: addressData.mobile || '',
        email: addressData.email || '',
        address: addressData.address || '',
        landmark: addressData.landmark || '',
        pincode: addressData.pincode || '',
        latitude: addressData.latitude || '',
        longitude: addressData.longitude || ''
      });

      // Set selected state and city if available
      if (addressData.state_id) {
        // Find and set the state
        const state = states.find(s => s.id === addressData.state_id);
        if (state) {
          setSelectedState(state);
        }
      }

      if (addressData.city_id) {
        // Find and set the city
        const city = cities.find(c => c.id === addressData.city_id);
        if (city) {
          setSelectedCity(city);
        }
      }
    }
  }, [editMode, addressData, states, cities]);

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to set your address.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS permissions are handled in Info.plist
  };

  // Get current location
  const getCurrentLocation = () => {
    setIsLocationLoading(true);
    requestLocationPermission().then(hasPermission => {
      if (hasPermission) {
        Geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            }));
            setIsLocationLoading(false);
            setMapModalVisible(true);
          },
          error => {
            console.log('Location error:', error);
            Alert.alert('Error', 'Unable to get your current location');
            setIsLocationLoading(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      } else {
        Alert.alert('Permission Denied', 'Location permission is required to get your current location');
        setIsLocationLoading(false);
      }
    });
  };

  // Handle map marker drag
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCurrentLocation({ latitude, longitude });
    setFormData(prev => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
  };

  const handleStateSelect = state => {
    setSelectedState(state);
    setSelectedCity(null);
    setCities([]);
    setStateModalVisible(false);

    // Fetch cities for selected state
    const formData = new FormData();
    formData.append('accesskey', API_ACCESS_KEY);
    formData.append('state_id', state.id);

    axios
      .post(ADD_NEW_ADDRESS_CITY, formData)
      .then(res => {
        console.log('Fetched cities:', res.data); // Added console.log for debugging
        setCities(res.data.data || []);
      })
      .catch(err => console.error('Error fetching cities:', err));
  };

  const handleCitySelect = city => {
    setSelectedCity(city);
    setCityModalVisible(false);
  };

  const renderModalItem = (item, onSelect) => (
    <TouchableOpacity
      style={{
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('4%'),
        borderBottomWidth: 1,
        borderBottomColor: BORDER_BOTTOM_COLOR,
      }}
      onPress={() => onSelect(item)}
    >
      <Text style={{ fontSize: wp('4.5%'), color: TEXT_COLOR_DARK }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#F70D24" />
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => {
            if (navigation && navigation.goBack) {
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.headerBackText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{editMode ? 'Edit Address' : 'Add Address'}</Text>
        <View style={{ width: wp('9%') }} />
        {/* Placeholder for symmetry */}
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Name, Phone, Email Inputs */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Name"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Phone number"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              keyboardType="phone-pad"
              value={formData.mobile}
              onChangeText={(text) => setFormData({...formData, mobile: text})}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
          </View>

          {/* Address */}
          <View style={[styles.inputContainer, styles.addressInputContainer]}>
            <TextInput
              placeholder="Address"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={[styles.input, styles.addressInput]}
              multiline
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
            />
          </View>

          {/* Dropdowns */}
          <DropdownSelector
            label={selectedState ? selectedState.name : 'Select State'}
            onPress={() => setStateModalVisible(true)}
          />
          <DropdownSelector
            label={selectedCity ? selectedCity.name : 'Select City'}
            onPress={() => {
              if (cities.length > 0) {
                setCityModalVisible(true);
              }
            }}
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Pin Code"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              keyboardType="number-pad"
              value={formData.pincode}
              onChangeText={(text) => setFormData({...formData, pincode: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Landmark (Optional)"
              placeholderTextColor={TEXT_COLOR_DARK}
              style={styles.input}
              value={formData.landmark}
              onChangeText={(text) => setFormData({...formData, landmark: text})}
            />
          </View>

          {/* Location Picker */}
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={getCurrentLocation}
            disabled={isLocationLoading}
          >
            <Icon name="map-marker" size={20} color="#F40612" />
            <Text style={styles.locationButtonText}>
              {isLocationLoading ? 'Getting Location...' : 'Pick Location on Map'}
            </Text>
          </TouchableOpacity>

          {/* Location Display */}
          {formData.latitude && formData.longitude && (
            <View style={styles.locationDisplay}>
              <Text style={styles.locationText}>
                Lat: {parseFloat(formData.latitude).toFixed(6)}, 
                Lng: {parseFloat(formData.longitude).toFixed(6)}
              </Text>
            </View>
          )}

          <Text style={styles.locationLabel}>
            Location : {selectedState ? selectedState.name : 'Select State'},
            India
          </Text>

          <Image
            source={{ uri: 'https://placehold.co/800x400/f0f0f0/666666' }}
            style={styles.mapImage}
            alt="Map"
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{editMode ? 'Update Address' : 'Save Address & Continue'}</Text>
        </TouchableOpacity>
      </View>

      {/* State Modal */}
      <Modal
        visible={stateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStateModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStateModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: BACKGROUND_COLOR,
                marginHorizontal: wp('10%'),
                borderRadius: wp('2%'),
                maxHeight: hp('50%'),
              }}
            >
              <FlatList
                data={states}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) =>
                  renderModalItem(item, handleStateSelect)
                }
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* City Modal */}
      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCityModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: BACKGROUND_COLOR,
                marginHorizontal: wp('10%'),
                borderRadius: wp('2%'),
                maxHeight: hp('50%'),
              }}
            >
              <FlatList
                data={cities}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) =>
                  renderModalItem(item, handleCitySelect)
                }
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Map Modal */}
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        onRequestClose={() => setMapModalVisible(false)}
      >
        <SafeAreaView style={styles.mapModalContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity 
              onPress={() => setMapModalVisible(false)}
              style={styles.mapCloseButton}
            >
              <Icon name="times" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.mapHeaderTitle}>Select Location</Text>
            <TouchableOpacity 
              onPress={() => setMapModalVisible(false)}
              style={styles.mapConfirmButton}
            >
              <Text style={styles.mapConfirmText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Icon name="map-marker" size={60} color="#F40612" />
              <Text style={styles.mapPlaceholderText}>Location Selected</Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Lat: {currentLocation.latitude.toFixed(6)}
              </Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Lng: {currentLocation.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity 
                style={styles.updateLocationButton}
                onPress={getCurrentLocation}
              >
                <Text style={styles.updateLocationButtonText}>Update Location</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.mapFooter}>
            <Text style={styles.mapFooterText}>
              Location coordinates will be automatically saved to your address
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Keep your previous styles
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F70D24',
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Montserrat-Bold',
  },
  headerBackButton: {
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('9%'),
    height: hp('5%'),
  },
  headerBackText: {
    color: '#fff',
    fontSize: wp('6%'),
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: hp('2.5%') },
  formContainer: { paddingHorizontal: wp('4%'), paddingTop: hp('3%') },
  inputContainer: {
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    marginBottom: hp('2.5%'),
    paddingHorizontal: wp('4%'),
  },
  input: { fontSize: wp('4.5%'), color: TEXT_COLOR_DARK, height: hp('6.5%') },
  addressInputContainer: { height: hp('13%'), paddingVertical: hp('1.5%') },
  addressInput: { height: '100%', textAlignVertical: 'top' },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: BORDER_BOTTOM_COLOR,
    paddingBottom: hp('2.2%'),
    marginBottom: hp('2.5%'),
  },
  dropdownText: { fontSize: wp('4.5%'), color: TEXT_COLOR_DARK },
  locationLabel: {
    fontSize: wp('4%'),
    color: TEXT_COLOR_MEDIUM,
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
  },
  mapImage: {
    width: '100%',
    height: hp('22%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  footer: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    backgroundColor: BACKGROUND_COLOR,
  },
  saveButton: {
    backgroundColor: HEADER_COLOR,
    borderRadius: wp('2%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: BACKGROUND_COLOR,
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
  },
  // Location picker styles
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#F40612',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    marginBottom: hp('1%'),
  },
  locationButtonText: {
    marginLeft: wp('3%'),
    color: '#F40612',
    fontSize: wp('4%'),
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },
  locationDisplay: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    marginBottom: hp('1%'),
  },
  locationText: {
    color: '#2e7d32',
    fontSize: wp('3.5%'),
    fontFamily: 'Montserrat-Regular',
  },
  // Map modal styles
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F40612',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  mapCloseButton: {
    padding: wp('2%'),
  },
  mapHeaderTitle: {
    color: '#FFFFFF',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  mapConfirmButton: {
    padding: wp('2%'),
  },
  mapConfirmText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  map: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: wp('4%'),
  },
  mapPlaceholderText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#F40612',
    marginTop: hp('2%'),
    fontFamily: 'Montserrat-Bold',
  },
  mapPlaceholderSubtext: {
    fontSize: wp('3.5%'),
    color: '#666666',
    textAlign: 'center',
    marginTop: hp('1%'),
    marginBottom: hp('3%'),
    fontFamily: 'Montserrat-Regular',
  },
  updateLocationButton: {
    backgroundColor: '#F40612',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
  },
  updateLocationButtonText: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  mapFooter: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  mapFooterText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: wp('3.5%'),
    fontFamily: 'Montserrat-Regular',
  },
});

export default AddAddress;
