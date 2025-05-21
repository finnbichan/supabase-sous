import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity} from 'react-native';
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
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const { colours } = useTheme();
  const styles = useStyles();

  console.log(colours)

  const signUp = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        data: {
          display_name: name,
          region: country.id
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
    return (
    <SafeAreaView style={[styles.container, {backgroundColor: colours.background}]}>
      <View style={styles.content}>
        <AppHeaderText>Welcome to sous.</AppHeaderText>
        <AppText>We need a few details from you to get started.</AppText>
        <FLTextInput
        id="email"
        label="Email"
        defaultValue={email}
        onChangeTextProp={setEmail}
        editable={true}
        />
        <FLTextInput
        id="name"
        label="Display Name"
        defaultValue={name}
        onChangeTextProp={setName}
        editable={true}
        />
        <Dropdown
          data={countries}
          label="Region"
          onSelect={setCountry}
        />
        <AppText>We don't use passwords here - when you click sign up, we'll send a one time password to your email address.</AppText>
        {loading ? <ActivityIndicator /> : (
          <AppButton
          onPress={signUp}
          label="Sign Up"
          />
        )}
        <AppText>Already have an account? <Text style={{color: colours.text, textDecorationLine: 'underline'}} onPress={() => navigation.navigate('Login')}>Log in</Text></AppText>
  </View>
</SafeAreaView>
)
}

export default NewUser;