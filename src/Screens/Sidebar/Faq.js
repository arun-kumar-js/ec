import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const Faq = () => {
  const navigation = useNavigation();
  const [expandedItem, setExpandedItem] = useState(null);

  const faqData = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer:
        'To place an order, browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit/debit cards, UPI, or cash on delivery.',
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit and debit cards, UPI payments, net banking, and cash on delivery. All online payments are secured with SSL encryption.',
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer:
        'Standard delivery takes 2-5 business days depending on your location. Express delivery is available for select areas with 1-2 day delivery.',
    },
    {
      id: 4,
      question: 'Can I cancel my order?',
      answer:
        'Yes, you can cancel your order within 24 hours of placing it. For orders that have already been shipped, you can return the product within 7 days of delivery.',
    },
    {
      id: 5,
      question: 'What is your return policy?',
      answer:
        'We offer a 7-day return policy for most products. The item must be unused and in its original packaging. Some items like perishables and personal care products are non-returnable.',
    },
    {
      id: 6,
      question: 'How can I track my order?',
      answer:
        'You can track your order by going to the "Track Order" section in the app menu and entering your order number. You will also receive SMS updates on your registered mobile number.',
    },
    {
      id: 7,
      question: 'Do you deliver to all locations?',
      answer:
        'We currently deliver to most major cities and towns across India. You can check delivery availability by entering your pincode on our website or app.',
    },
    {
      id: 8,
      question: 'What if I receive a damaged product?',
      answer:
        'If you receive a damaged product, please take photos and contact our customer support within 24 hours. We will arrange a replacement or refund.',
    },
    {
      id: 9,
      question: 'How can I contact customer support?',
      answer:
        'You can contact us through our 24/7 helpline at +91 98765 43210, email at support@spiderekart.in, or through the chat feature in our app.',
    },
    {
      id: 10,
      question: 'Are there any delivery charges?',
      answer:
        'Free delivery is available on orders above ₹500. For orders below ₹500, a nominal delivery charge of ₹50 applies.',
    },
  ];

  const toggleItem = id => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const renderFaqItem = item => {
    const isExpanded = expandedItem === item.id;

    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity
          style={styles.questionContainer}
          onPress={() => toggleItem(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={wp('4%')}
            color="#666"
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: wp('6%') }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Icon name="help-circle" size={wp('15%')} color="#e60023" />
          <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
          <Text style={styles.headerSubtitle}>
            Find answers to common questions about our services
          </Text>
        </View>

        {/* FAQ List */}
        <View style={styles.faqContainer}>{faqData.map(renderFaqItem)}</View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <Text style={styles.contactText}>
            If you couldn't find the answer you're looking for, please contact
            our customer support team.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Icon name="headset" size={wp('4%')} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
    backgroundColor: '#e60023',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: hp('4%'),
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
    marginTop: hp('2%'),
    marginBottom: hp('1%'),
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
  },
  faqContainer: {
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
  },
  questionText: {
    fontSize: wp('4%'),
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: wp('2%'),
  },
  answerContainer: {
    paddingHorizontal: wp('4%'),
    paddingBottom: wp('4%'),
  },
  answerText: {
    fontSize: wp('3.5%'),
    lineHeight: wp('5%'),
    color: '#666',
  },
  contactSection: {
    backgroundColor: '#fff',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    padding: wp('4%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
  },
  contactText: {
    fontSize: wp('3.5%'),
    color: '#666',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  contactButton: {
    backgroundColor: '#e60023',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('2%'),
    gap: wp('2%'),
  },
  contactButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
});

export default Faq;


