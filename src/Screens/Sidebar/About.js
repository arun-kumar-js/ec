import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const AboutScreen = () => {
  const navigation = useNavigation();

  const handleContact = type => {
    switch (type) {
      case 'phone':
        Linking.openURL('tel:+919876543210');
        break;
      case 'email':
        Linking.openURL('mailto:info@spiderekart.com');
        break;
      case 'website':
        Linking.openURL('https://spiderekart.com');
        break;
      case 'location':
        Linking.openURL('https://maps.google.com/?q=Mumbai,India');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: wp('6%') }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Company Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Icon name="cart" size={wp('15%')} color="#007AFF" />
          </View>
          <Text style={styles.companyName}>Spider E-Kart</Text>
          <Text style={styles.tagline}>Your Trusted Shopping Partner</Text>
        </View>

        {/* Company Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.description}>
            Founded in 2020, Spider E-Kart has been at the forefront of digital
            commerce, revolutionizing the way people shop online. We started
            with a simple mission: to make quality products accessible to
            everyone, everywhere.
          </Text>
          <Text style={styles.description}>
            Today, we serve millions of customers across India, offering a vast
            selection of products from trusted brands and local artisans. Our
            commitment to quality, customer satisfaction, and innovation drives
            everything we do.
          </Text>
        </View>

        {/* Mission & Vision */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.description}>
            To provide seamless, reliable, and enjoyable shopping experiences
            while supporting local businesses and promoting sustainable commerce
            practices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Vision</Text>
          <Text style={styles.description}>
            To become India's most trusted and customer-centric e-commerce
            platform, empowering millions of sellers and delighting customers
            with innovative solutions.
          </Text>
        </View>

        {/* Values */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesList}>
            <View style={styles.valueItem}>
              <Icon name="shield-checkmark" size={wp('5%')} color="#007AFF" />
              <Text style={styles.valueText}>Trust & Reliability</Text>
            </View>
            <View style={styles.valueItem}>
              <Icon name="heart" size={wp('5%')} color="#007AFF" />
              <Text style={styles.valueText}>Customer First</Text>
            </View>
            <View style={styles.valueItem}>
              <Icon name="bulb" size={wp('5%')} color="#007AFF" />
              <Text style={styles.valueText}>Innovation</Text>
            </View>
            <View style={styles.valueItem}>
              <Icon name="people" size={wp('5%')} color="#007AFF" />
              <Text style={styles.valueText}>Community</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('phone')}
          >
            <Icon name="call" size={wp('5%')} color="#007AFF" />
            <Text style={styles.contactText}>+91 98765 43210</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('email')}
          >
            <Icon name="mail" size={wp('5%')} color="#007AFF" />
            <Text style={styles.contactText}>info@spiderekart.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('website')}
          >
            <Icon name="globe" size={wp('5%')} color="#007AFF" />
            <Text style={styles.contactText}>www.spiderekart.com</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleContact('location')}
          >
            <Icon name="location" size={wp('5%')} color="#007AFF" />
            <Text style={styles.contactText}>Mumbai, Maharashtra, India</Text>
          </TouchableOpacity>
        </View>

        {/* Business Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          <View style={styles.hoursItem}>
            <Text style={styles.hoursDay}>Monday - Friday</Text>
            <Text style={styles.hoursTime}>9:00 AM - 8:00 PM</Text>
          </View>
          <View style={styles.hoursItem}>
            <Text style={styles.hoursDay}>Saturday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.hoursItem}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 4:00 PM</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Spider E-Kart. All rights reserved.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  logoSection: {
    alignItems: 'center',
    paddingVertical: hp('4%'),
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
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
  companyName: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  tagline: {
    fontSize: wp('3.5%'),
    color: '#666',
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
    marginBottom: hp('2%'),
  },
  description: {
    fontSize: wp('3.5%'),
    color: '#666',
    lineHeight: wp('5%'),
    marginBottom: hp('2%'),
  },
  valuesList: {
    marginTop: hp('2%'),
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  valueText: {
    fontSize: wp('4%'),
    color: '#333',
    marginLeft: wp('3%'),
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactText: {
    fontSize: wp('4%'),
    color: '#333',
    marginLeft: wp('3%'),
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hoursDay: {
    fontSize: wp('4%'),
    color: '#333',
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: wp('4%'),
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
    marginBottom: hp('1%'),
  },
  versionText: {
    fontSize: wp('3%'),
    color: '#999',
  },
});

export default AboutScreen;
