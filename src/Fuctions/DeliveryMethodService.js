import axios from 'axios';
import { API_ACCESS_KEY, GET_ALL_ADDRESSES } from '../config/config';

export const getDeliveryMethods = async () => {
  try {
    const formData = new FormData();
    formData.append('accesskey', API_ACCESS_KEY);

    // Log form data
    console.log('=== GET DELIVERY METHODS ===');
    console.log('Access Key:', API_ACCESS_KEY);
    console.log('Form Data:', {
      accesskey: API_ACCESS_KEY,
    });

    const response = await axios.post(
      `${GET_ALL_ADDRESSES}/getdeliverymethod.php`,
      formData,
    );

    console.log('=== DELIVERY METHODS API RESPONSE ===');
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    console.log('Full Response Data:', response.data);

    if (response.data && response.data.error === false) {
      console.log('✅ Success: Delivery methods fetched successfully');
      return {
        success: true,
        data: response.data.data || response.data,
      };
    } else {
      console.error('❌ Error: Delivery methods API returned error');
      console.error('Error Message:', response.data.message);
      return {
        success: false,
        data: null,
      };
    }
  } catch (error) {
    console.error('=== DELIVERY METHODS API ERROR ===');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    } else if (error.request) {
      console.error('No Response Received:', error.request);
    }
    console.error('Full Error Object:', error);
    return {
      success: false,
      data: null,
    };
  }
};
