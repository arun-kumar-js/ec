import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ContactScreen = () => {
  const navigation = useNavigation();

  const handleContact = type => {
    switch (type) {
      case 'phone':
        Linking.openURL('tel:+919876543210');
        break;
      case 'whatsapp':
        Linking.openURL(
          'whatsapp://send?phone=919876543210&text=Hello, I need help with my order.',
        );
        break;
      case 'email':
        Linking.openURL(
          'mailto:support@spiderekart.com?subject=Customer Support',
        );
        break;
      case 'website':
        Linking.openURL('https://spiderekart.com');
        break;
      case 'location':
        Linking.openURL('https://maps.google.com/?q=Mumbai,India');
        break;
      case 'facebook':
        Linking.openURL('https://facebook.com/spiderekart');
        break;
      case 'twitter':
        Linking.openURL('https://twitter.com/spiderekart');
        break;
      case 'instagram':
        Linking.openURL('https://instagram.com/spiderekart');
        break;
    }
  };

  const handleSupportRequest = () => {
    Alert.alert('Support Request', 'How can we help you?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call Support', onPress: () => handleContact('phone') },
      { text: 'Email Support', onPress: () => handleContact('email') },
      { text: 'WhatsApp', onPress: () => handleContact('whatsapp') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: wp('6%') }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Contact</Text>
          <Text style={styles.sectionSubtitle}>
            Get in touch with us for any queries or support
          </Text>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleSupportRequest}
          >
            <View style={styles.contactCardContent}>
              <Icon name="headset" size={wp('8%')} color="#007AFF" />
              <Text style={styles.contactCardTitle}>Need Help?</Text>
              <Text style={styles.contactCardSubtitle}>
                Tap to get instant support
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Methods</Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('phone')}
          >
            <View style={styles.contactIcon}>
              <Icon name="call" size={wp('6%')} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+91 98765 43210</Text>
              <Text style={styles.contactDesc}>Available 24/7</Text>
            </View>
            <Icon name="chevron-forward" size={wp('5%')} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('whatsapp')}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#25D366' }]}>
              <Icon name="logo-whatsapp" size={wp('6%')} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>WhatsApp</Text>
              <Text style={styles.contactValue}>+91 98765 43210</Text>
              <Text style={styles.contactDesc}>Quick chat support</Text>
            </View>
            <Icon name="chevron-forward" size={wp('5%')} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('email')}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#FF6B35' }]}>
              <Icon name="mail" size={wp('6%')} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@spiderekart.com</Text>
              <Text style={styles.contactDesc}>Detailed queries</Text>
            </View>
            <Icon name="chevron-forward" size={wp('5%')} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Office Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Office Information</Text>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('location')}
          >
            <View style={[styles.contactIcon, { backgroundColor: '#28a745' }]}>
              <Icon name="location" size={wp('6%')} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Head Office</Text>
              <Text style={styles.contactValue}>Mumbai, Maharashtra</Text>
              <Text style={styles.contactDesc}>India</Text>
            </View>
            <Icon name="chevron-forward" size={wp('5%')} color="#ccc" />
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <View style={[styles.contactIcon, { backgroundColor: '#6c757d' }]}>
              <Icon name="time" size={wp('6%')} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Business Hours</Text>
              <Text style={styles.contactValue}>
                Mon-Fri: 9:00 AM - 8:00 PM
              </Text>
              <Text style={styles.contactDesc}>
                Sat-Sun: 10:00 AM - 6:00 PM
              </Text>
            </View>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <Text style={styles.sectionSubtitle}>
            Stay updated with our latest offers and news
          </Text>

          <View style={styles.socialGrid}>
            <TouchableOpacity
              style={styles.socialItem}
              onPress={() => handleContact('facebook')}
            >
              <Icon name="logo-facebook" size={wp('8%')} color="#1877F2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialItem}
              onPress={() => handleContact('twitter')}
            >
              <Icon name="logo-twitter" size={wp('8%')} color="#1DA1F2" />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialItem}
              onPress={() => handleContact('instagram')}
            >
              <Icon name="logo-instagram" size={wp('8%')} color="#E4405F" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialItem}
              onPress={() => handleContact('website')}
            >
              <Icon name="globe" size={wp('8%')} color="#007AFF" />
              <Text style={styles.socialText}>Website</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Link */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.faqCard}
            onPress={() => navigation.navigate('Faq')}
          >
            <View style={styles.faqContent}>
              <Icon name="help-circle" size={wp('8%')} color="#007AFF" />
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqSubtitle}>
                Find answers to common questions
              </Text>
            </View>
            <Icon name="chevron-forward" size={wp('6%')} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            We're here to help! Contact us anytime.
          </Text>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  sectionSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginBottom: hp('3%'),
  },
  contactCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    alignItems: 'center',
  },
  contactCardContent: {
    alignItems: 'center',
  },
  contactCardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  contactCardSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactIcon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  contactValue: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  contactDesc: {
    fontSize: wp('3%'),
    color: '#666',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: wp('2%'),
    padding: wp('4%'),
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  socialText: {
    fontSize: wp('3.5%'),
    color: '#333',
    marginTop: hp('1%'),
    fontWeight: '500',
  },
  faqCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqContent: {
    flex: 1,
    alignItems: 'center',
  },
  faqTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  faqSubtitle: {
    fontSize: wp('3%'),
    color: '#666',
  },
  footer: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    alignItems: 'center',
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
  },
});

export default ContactScreen;
