import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../../supabase';
import useStyles from '../styles/Common';
import AppText from '../components/AppText';
import AppHeaderText from '../components/AppHeaderText';
import FLTextInput from '../components/FloatingLabelInput';
import AppButton from '../components/AppButton';

const ConfirmOTP = ({ route }) => {
  const styles = useStyles();
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
        <AppHeaderText>Confirm your one time password</AppHeaderText>
        <AppText>We've sent a one time password to {email}. Type it in below to get cooking.</AppText>
        <FLTextInput
        id="otp"
        label="Password"
        onChangeTextProp={(text) => setOTP(text)}
        />
        { loading ? <ActivityIndicator/>
        : (
        <AppButton
        label="Submit"
        onPress={submitOTP}
        />
        )}
  </View>
</SafeAreaView>
)
}

export default ConfirmOTP;