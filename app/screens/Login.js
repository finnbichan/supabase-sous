import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView} from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../../supabase';
import AppHeaderText from '../components/AppHeaderText';
import AppText from '../components/AppText';
import FLTextInput from '../components/FloatingLabelInput';
import AppButton from '../components/AppButton';
import useStyles from '../styles/Common';

const Login = ( { navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = useStyles();

  const signIn = async () => {
    setLoading(true);
    const {data, error} = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false
      }
  })
  if (error) {
    console.log(error);
    setLoading(false);
  } else {
    console.log(data)
    setLoading(false);
    navigation.navigate('Confirm OTP', {
      email: email
    });
  }
}


    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AppHeaderText>Good to see you again</AppHeaderText>
        <AppText style={styles.text}>Enter your email below to log in. We'll send a one time password to your email address to check it's really you.</AppText>
        <FLTextInput
        id="email"
        label="Email"
        defaultValue={email}
        onChangeTextProp={setEmail}
        editable={true}
        />
        { loading ? <ActivityIndicator/>
        : (
              <AppButton
              label="Log In"
              onPress={signIn}
              />
        )}
  </View>
</SafeAreaView>
)
}

export default Login;