import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VERIFY_OTP_ENDPOINT, API_ACCESS_KEY } from '../config/config';

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      formData.append('mobile', phoneNumber);
      formData.append('otp', otpString);

      const response = await axios.post(VERIFY_OTP_ENDPOINT, formData);

      if (response.data && response.data.error === 'false') {
        // Save user data
        await AsyncStorage.setItem(
          'userData',
          JSON.stringify(response.data.data),
        );
        await AsyncStorage.setItem('userToken', response.data.data.token || '');

        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainStack' }],
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setCanResend(false);
    setTimer(30);
    setOtp(['', '', '', '', '', '']);

    try {
      const formData = new FormData();
      formData.append('accesskey', API_ACCESS_KEY);
      formData.append('mobile', phoneNumber);

      const response = await axios.post(VERIFY_OTP_ENDPOINT, formData);

      if (response.data && response.data.error === 'false') {
        Alert.alert('Success', 'OTP resent successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={wp('6%')} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify OTP</Text>
            <View style={{ width: wp('6%') }} />
          </View>

          {/* OTP Form */}
          <View style={styles.formSection}>
            <View style={styles.iconContainer}>
              <Icon name="phone-portrait" size={wp('15%')} color="#007AFF" />
            </View>

            <Text style={styles.titleText}>Enter OTP</Text>
            <Text style={styles.subtitleText}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.phoneText}>+91 {phoneNumber}</Text>
            </Text>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                loading && styles.verifyButtonDisabled,
              ]}
              onPress={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? (
                <Text style={styles.verifyButtonText}>Verifying...</Text>
              ) : (
                <Text style={styles.verifyButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={styles.resendSection}>
              <Text style={styles.resendText}>
                Didn't receive the code?{' '}
                {canResend ? (
                  <TouchableOpacity onPress={handleResendOtp}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.timerText}>Resend in {timer}s</Text>
                )}
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('2%'),
    marginBottom: hp('4%'),
  },
  headerTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('4%'),
  },
  titleText: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('2%'),
  },
  subtitleText: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
    lineHeight: wp('5%'),
    marginBottom: hp('4%'),
  },
  phoneText: {
    fontWeight: '600',
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: hp('4%'),
  },
  otpInput: {
    width: wp('12%'),
    height: wp('12%'),
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: wp('2%'),
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    width: '100%',
    marginBottom: hp('3%'),
  },
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  resendSection: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  timerText: {
    color: '#999',
  },
});

export default OtpScreen;
