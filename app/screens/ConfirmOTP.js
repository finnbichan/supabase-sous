import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';

const ConfirmOTP = ({ route }) => {
  const [OTP, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = route.params;
  const submitOTP = async () => {
    setLoading(true)
    await supabase.auth.verifyOtp({
      email: email,
      token: OTP,
      type: 'email'
    })
    .then((data) => {console.log("success", data)})
    .catch((error) => {console.log("error", error)})
    .finally(() => {setLoading(false)})
  }
  console.log(email)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Confirm your one time password</Text>
        <Text style={styles.text}>We've sent a one time password to {email}. Type it in below to get cooking.</Text>
        <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a9a9a9"
        onChangeText={(text) => setOTP(text)}
        />
        <TouchableOpacity 
        onPress={submitOTP}
        style={styles.button}
        >
          <Text
          style={styles.buttonText}
          >
            Submit
          </Text>
        </TouchableOpacity>
  </View>
</SafeAreaView>
)
}

export default ConfirmOTP;