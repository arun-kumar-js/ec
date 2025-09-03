import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LOGIN_ENDPOINT, API_ACCESS_KEY } from '../config/config';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      formData.append('mobile', phoneNumber);

      const response = await axios.post(LOGIN_ENDPOINT, formData);
      
      if (response.data && response.data.error === 'false') {
        navigation.navigate('OtpScreen', { phoneNumber });
      } else {
        Alert.alert('Error', response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Icon name="cart" size={wp('15%')} color="#007AFF" />
            </View>
            <Text style={styles.appName}>Spider E-Kart</Text>
            <Text style={styles.tagline}>Your Shopping Partner</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            <Text style={styles.welcomeText}>Welcome Back!</Text>
            <Text style={styles.subtitleText}>
              Enter your phone number to continue
            </Text>

            <View style={styles.inputContainer}>
              <View style={styles.phonePrefix}>
                <Text style={styles.prefixText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.loginButtonText}>Sending OTP...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.linkText}>Terms & Conditions</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={styles.linkText}>Contact Support</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('6%'),
  },
  logoSection: {
    alignItems: 'center',
    marginTop: hp('8%'),
    marginBottom: hp('6%'),
  },
  logoContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  appName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  tagline: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  subtitleText: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    marginBottom: hp('3%'),
    backgroundColor: '#f9f9f9',
  },
  phonePrefix: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: wp('3%'),
    justifyContent: 'center',
    borderTopLeftRadius: wp('2%'),
    borderBottomLeftRadius: wp('2%'),
  },
  prefixText: {
    fontSize: wp('4%'),
    color: '#333',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('2%'),
    fontSize: wp('4%'),
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  termsText: {
    fontSize: wp('3%'),
    color: '#666',
    textAlign: 'center',
    lineHeight: wp('4.5%'),
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
});

export default LoginScreen;
