import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import '../../globals';
import Dropdown from '../components/Dropdown';
import FLTextInput from '../components/FloatingLabelInput';
import AppText from '../components/AppText';
import AppHeaderText from '../components/AppHeaderText';
import AppButton from '../components/AppButton';
import { useTheme } from '@react-navigation/native';
import useStyles from '../styles/Common';


const NewUser = ( {navigation} ) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { colours } = useTheme();
  const styles = useStyles();

  const signUp = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        data: {
          should_create_user: true
        }
      }
    })
    .then(() => {
      navigation.navigate('Confirm OTP', {
        email: email
      });
    })
    .catch((error) => {console.log(error);})
    .finally(() => {setLoading(false)}) 
  }

  const newUserStyles = StyleSheet.create({
    alreadyHaveAccount: {
      marginBottom: 16,
      alignItems: 'flex-start'
    },
    accountText: {
      color: colours.secondaryText,
      fontSize: 14
    },
    loginLink: {
      color: colours.text,
      textDecorationLine: 'underline'
    }
  });

    return (
    <SafeAreaView style={[styles.container, {backgroundColor: colours.background}]}>
      <View style={styles.content}>
        <AppHeaderText>Welcome to sous.</AppHeaderText>
        <AppText>Enter your email address below to get cooking.</AppText>
        <AppText>We'll send you a code to verify your account.</AppText>
        {/* Email and Sign Up */}
        <FLTextInput
        id="email"
        label="Email"
        defaultValue={email}
        onChangeTextProp={setEmail}
        editable={true}
        />
        {loading ? <ActivityIndicator /> : (
          <AppButton
          onPress={signUp}
          label="Continue"
          />
        )}
  </View>
</SafeAreaView>
)
}

export default NewUser;