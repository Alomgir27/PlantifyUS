import React from 'react';
import { View, Button, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';

const RazorpayPayment = () => {
  const handleRazorpayPayment = () => {
    const options = {
      description: 'Test Payment',
      image: 'https://your-company-logo.png',
      currency: 'INR',
      key: 'YOUR_RAZORPAY_API_KEY',
      amount: '10000', // amount in paisa (e.g., 10000 paisa = ₹100)
      name: 'Demo App',
      prefill: {
        email: 'test@example.com',
        contact: '9999999999',
      },
      theme: { color: '#F37254' },
    };

    RazorpayCheckout.open(options)
      .then((paymentData) => {
        // Handle success
        Alert.alert('Razorpay Payment', `Payment successful! Payment ID: ${paymentData.razorpay_payment_id}`);
      })
      .catch((error) => {
        // Handle error
        Alert.alert('Razorpay Payment', `Payment failed! Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <View>
      <Button title="Make Payment" onPress={handleRazorpayPayment} />
    </View>
  );
};

export default RazorpayPayment;
