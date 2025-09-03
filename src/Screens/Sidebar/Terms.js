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

const TermsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
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
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.description}>
            By accessing and using the Spider E-Kart mobile application and
            services, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the
            above, please do not use this service.
          </Text>
        </View>

        {/* Service Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Description</Text>
          <Text style={styles.description}>
            Spider E-Kart is an e-commerce platform that allows users to browse,
            purchase, and receive delivery of various products. Our services
            include:{'\n\n'}• Product browsing and search functionality{'\n'}•
            Online ordering and payment processing{'\n'}• Delivery and shipping
            services{'\n'}• Customer support and assistance{'\n'}• Account
            management and personalization
          </Text>
        </View>

        {/* User Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.description}>
            To use certain features of our service, you must create an account.
            You are responsible for:{'\n\n'}• Providing accurate and complete
            information{'\n'}• Maintaining the security of your account
            credentials{'\n'}• All activities that occur under your account
            {'\n'}• Notifying us immediately of any unauthorized use{'\n'}•
            Ensuring you are at least 18 years old or have parental consent
          </Text>
        </View>

        {/* Product Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Product Information</Text>
          <Text style={styles.description}>
            We strive to provide accurate product information, but we do not
            warrant that product descriptions, prices, or other content is
            accurate, complete, reliable, current, or error-free. Product images
            are for illustrative purposes and may not reflect the exact
            appearance of the product.
          </Text>
        </View>

        {/* Pricing and Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Pricing and Payment</Text>
          <Text style={styles.description}>
            All prices are listed in Indian Rupees (₹) and are subject to change
            without notice. You agree to pay all charges incurred by your
            account at the prices in effect when such charges are incurred. We
            accept various payment methods as displayed during checkout.
          </Text>
        </View>

        {/* Order Processing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Order Processing</Text>
          <Text style={styles.description}>
            • Orders are subject to acceptance and availability{'\n'}• We
            reserve the right to refuse or cancel any order{'\n'}• Order
            confirmation does not guarantee product availability{'\n'}• Delivery
            times are estimates and may vary{'\n'}• We may cancel orders due to
            pricing errors or other issues
          </Text>
        </View>

        {/* Delivery and Shipping */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Delivery and Shipping</Text>
          <Text style={styles.description}>
            • Delivery is available to specified areas only{'\n'}• Delivery
            charges may apply based on location{'\n'}• Risk of loss transfers to
            you upon delivery{'\n'}• You must be present to receive the delivery
            {'\n'}• We are not responsible for delivery delays beyond our
            control
          </Text>
        </View>

        {/* Returns and Refunds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Returns and Refunds</Text>
          <Text style={styles.description}>
            • Returns must be initiated within 7 days of delivery{'\n'}•
            Products must be in original condition and packaging{'\n'}• Certain
            products may not be eligible for return{'\n'}• Refunds will be
            processed within 5-7 business days{'\n'}• Return shipping costs may
            apply
          </Text>
        </View>

        {/* User Conduct */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. User Conduct</Text>
          <Text style={styles.description}>
            You agree not to:{'\n\n'}• Use the service for any unlawful purpose
            {'\n'}• Attempt to gain unauthorized access to our systems{'\n'}•
            Interfere with or disrupt the service{'\n'}• Submit false or
            misleading information{'\n'}• Violate any applicable laws or
            regulations
          </Text>
        </View>

        {/* Intellectual Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Intellectual Property</Text>
          <Text style={styles.description}>
            All content, features, and functionality of our service are owned by
            Spider E-Kart and are protected by copyright, trademark, and other
            intellectual property laws. You may not reproduce, distribute, or
            create derivative works without our express written consent.
          </Text>
        </View>

        {/* Privacy Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Privacy Policy</Text>
          <Text style={styles.description}>
            Your privacy is important to us. Please review our Privacy Policy,
            which also governs your use of the service, to understand our
            practices regarding the collection and use of your personal
            information.
          </Text>
        </View>

        {/* Disclaimers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Disclaimers</Text>
          <Text style={styles.description}>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Limitation of Liability</Text>
          <Text style={styles.description}>
            IN NO EVENT SHALL SPIDER E-KART BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
            BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, INCURRED BY YOU OR
            ANY THIRD PARTY, WHETHER IN AN ACTION IN CONTRACT OR TORT.
          </Text>
        </View>

        {/* Indemnification */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Indemnification</Text>
          <Text style={styles.description}>
            You agree to indemnify and hold harmless Spider E-Kart from any
            claims, damages, losses, or expenses arising from your use of the
            service or violation of these terms.
          </Text>
        </View>

        {/* Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Termination</Text>
          <Text style={styles.description}>
            We may terminate or suspend your account and access to the service
            immediately, without prior notice, for any reason, including breach
            of these terms. Upon termination, your right to use the service will
            cease immediately.
          </Text>
        </View>

        {/* Governing Law */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Governing Law</Text>
          <Text style={styles.description}>
            These terms shall be governed by and construed in accordance with
            the laws of India. Any disputes arising from these terms or your use
            of the service shall be subject to the exclusive jurisdiction of the
            courts in Mumbai, Maharashtra.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Changes to Terms</Text>
          <Text style={styles.description}>
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes by posting the updated terms in
            our app and updating the "Last Updated" date. Your continued use of
            the service after such changes constitutes acceptance of the updated
            terms.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>18. Contact Information</Text>
          <Text style={styles.description}>
            If you have any questions about these Terms & Conditions, please
            contact us:{'\n\n'}
            Email: legal@spiderekart.com{'\n'}
            Phone: +91 98765 43210{'\n'}
            Address: Spider E-Kart, Mumbai, Maharashtra, India
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Spider E-Kart, you acknowledge that you have read,
            understood, and agree to be bound by these Terms & Conditions.
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

export default TermsScreen;
