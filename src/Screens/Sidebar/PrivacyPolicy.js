import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: wp('6%') }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Last Updated */}
        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            Last Updated: January 15, 2024
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.description}>
            At Spider E-Kart, we are committed to protecting your privacy and
            ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our mobile application and services.
          </Text>
        </View>

        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>

          <Text style={styles.subsectionTitle}>Personal Information</Text>
          <Text style={styles.description}>
            • Name and contact information (phone number, email address){'\n'}•
            Delivery addresses and shipping information{'\n'}• Payment
            information and transaction history{'\n'}• Account credentials and
            preferences{'\n'}• Communication records and customer support
            interactions
          </Text>

          <Text style={styles.subsectionTitle}>Device Information</Text>
          <Text style={styles.description}>
            • Device type, operating system, and unique device identifiers{'\n'}
            • IP address and location data{'\n'}• App usage statistics and crash
            reports{'\n'}• Browser type and version (for web access)
          </Text>

          <Text style={styles.subsectionTitle}>Usage Information</Text>
          <Text style={styles.description}>
            • Products viewed, searched, and purchased{'\n'}• Shopping cart
            contents and wishlist items{'\n'}• Navigation patterns and feature
            usage{'\n'}• Time spent on different sections of the app
          </Text>
        </View>

        {/* How We Use Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.description}>
            We use the collected information for the following purposes:{'\n\n'}
            • Process and fulfill your orders{'\n'}• Provide customer support
            and respond to inquiries{'\n'}• Send order confirmations and
            delivery updates{'\n'}• Personalize your shopping experience{'\n'}•
            Improve our products and services{'\n'}• Send promotional offers and
            newsletters (with your consent){'\n'}• Ensure security and prevent
            fraud{'\n'}• Comply with legal obligations
          </Text>
        </View>

        {/* Information Sharing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information Sharing</Text>
          <Text style={styles.description}>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information in the following
            circumstances:{'\n\n'}• With service providers who assist in our
            operations{'\n'}• With delivery partners to fulfill your orders
            {'\n'}• With payment processors to complete transactions{'\n'}• When
            required by law or to protect our rights{'\n'}• With your explicit
            consent
          </Text>
        </View>

        {/* Data Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.description}>
            We implement appropriate security measures to protect your personal
            information:{'\n\n'}• Encryption of sensitive data in transit and at
            rest{'\n'}• Regular security assessments and updates{'\n'}• Access
            controls and authentication mechanisms{'\n'}• Secure data centers
            and infrastructure{'\n'}• Employee training on data protection
            practices
          </Text>
        </View>

        {/* Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.description}>
            You have the following rights regarding your personal information:
            {'\n\n'}• Access and review your personal data{'\n'}• Request
            correction of inaccurate information{'\n'}• Request deletion of your
            personal data{'\n'}• Opt-out of marketing communications{'\n'}•
            Withdraw consent for data processing{'\n'}• Lodge complaints with
            supervisory authorities
          </Text>
        </View>

        {/* Cookies and Tracking */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cookies and Tracking</Text>
          <Text style={styles.description}>
            We use cookies and similar technologies to:{'\n\n'}• Remember your
            preferences and settings{'\n'}• Analyze app usage and performance
            {'\n'}• Provide personalized content and recommendations{'\n'}•
            Ensure secure authentication{'\n'}• Improve user experience
          </Text>
        </View>

        {/* Third-Party Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.description}>
            Our app may contain links to third-party services or integrate with
            external platforms. These services have their own privacy policies,
            and we are not responsible for their practices. We encourage you to
            review their privacy policies before using their services.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.description}>
            Our services are not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under
            13. If you believe we have collected information from a child under
            13, please contact us immediately.
          </Text>
        </View>

        {/* Data Retention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.description}>
            We retain your personal information for as long as necessary to
            provide our services and fulfill the purposes outlined in this
            policy. We may retain certain information for longer periods to
            comply with legal obligations, resolve disputes, or enforce our
            agreements.
          </Text>
        </View>

        {/* International Transfers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>International Data Transfers</Text>
          <Text style={styles.description}>
            Your information may be transferred to and processed in countries
            other than your own. We ensure that such transfers comply with
            applicable data protection laws and implement appropriate safeguards
            to protect your information.
          </Text>
        </View>

        {/* Policy Updates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policy Updates</Text>
          <Text style={styles.description}>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the updated policy in our app
            and updating the "Last Updated" date. Your continued use of our
            services after such changes constitutes acceptance of the updated
            policy.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.description}>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us:{'\n\n'}
            Email: privacy@spiderekart.com{'\n'}
            Phone: +91 98765 43210{'\n'}
            Address: Spider E-Kart, Mumbai, Maharashtra, India
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for trusting Spider E-Kart with your personal information.
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
  lastUpdated: {
    backgroundColor: '#fff',
    padding: wp('4%'),
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  lastUpdatedText: {
    fontSize: wp('3.5%'),
    color: '#666',
    fontStyle: 'italic',
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
  subsectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  description: {
    fontSize: wp('3.5%'),
    color: '#666',
    lineHeight: wp('5%'),
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
    fontStyle: 'italic',
  },
});

export default PrivacyPolicyScreen;
