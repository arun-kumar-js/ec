import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { address } = route.params || {};
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name || '',
        phone: address.phone || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        isDefault: address.isDefault || false,
      });
    }
  }, [address]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (formData.phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    
    if (formData.pincode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return false;
    }
    
    return true;
  };

  const saveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const savedAddresses = await AsyncStorage.getItem('userAddresses');
      let addresses = savedAddresses ? JSON.parse(savedAddresses) : [];
      
      const newAddress = {
        id: address ? address.id : Date.now().toString(),
        ...formData,
      };

      if (address) {
        // Update existing address
        addresses = addresses.map(addr => 
          addr.id === address.id ? newAddress : addr
        );
      } else {
        // Add new address
        if (formData.isDefault) {
          // Remove default from other addresses
          addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
        }
        addresses.push(newAddress);
      }

      await AsyncStorage.setItem('userAddresses', JSON.stringify(addresses));
      
      Alert.alert(
        'Success',
        address ? 'Address updated successfully' : 'Address added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={field === 'name' ? 'words' : 'none'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {address ? 'Edit Address' : 'Add New Address'}
        </Text>
        <View style={{ width: wp('6%') }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderInputField('Full Name', 'name', 'Enter your full name')}
          {renderInputField('Phone Number', 'phone', 'Enter your phone number', 'phone-pad')}
          {renderInputField('Address', 'address', 'Enter your complete address')}
          {renderInputField('City', 'city', 'Enter your city')}
          {renderInputField('State', 'state', 'Enter your state')}
          {renderInputField('Pincode', 'pincode', 'Enter 6-digit pincode', 'numeric')}

          {/* Default Address Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Set as default address</Text>
            <TouchableOpacity
              style={[styles.toggleButton, formData.isDefault && styles.toggleButtonActive]}
              onPress={() => updateFormData('isDefault', !formData.isDefault)}
            >
              <View style={[styles.toggleCircle, formData.isDefault && styles.toggleCircleActive]} />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={saveAddress}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <Text style={styles.saveButtonText}>
                {address ? 'Update Address' : 'Save Address'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: wp('4%'),
  },
  inputContainer: {
    marginBottom: hp('3%'),
  },
  inputLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('2%'),
    fontSize: wp('4%'),
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    marginBottom: hp('4%'),
  },
  toggleLabel: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#333',
  },
  toggleButton: {
    width: wp('12%'),
    height: wp('6%'),
    backgroundColor: '#e0e0e0',
    borderRadius: wp('3%'),
    justifyContent: 'center',
    paddingHorizontal: wp('1%'),
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleCircle: {
    width: wp('4%'),
    height: wp('4%'),
    backgroundColor: '#fff',
    borderRadius: wp('2%'),
    alignSelf: 'flex-start',
  },
  toggleCircleActive: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});

export default AddAddressScreen;
