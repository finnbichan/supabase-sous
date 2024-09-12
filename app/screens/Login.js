import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';

const Login = ( { navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false
      }
  })
  .then((data) => {console.log(data);console.log("here")})
  .catch((error) => {console.log(error);})
  .finally(() => {
    setLoading(false);
    navigation.navigate('Confirm OTP', {
      email: email
    });
  })
}


    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Good to see you again</Text>
        <Text style={styles.text}>Enter your email below to log in. We'll send a one time password to your email address to check it's really you.</Text>
        <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a9a9a9"
        onChangeText={(text) => setEmail(text)}
        />
        { loading ? <ActivityIndicator size="medium"/>
        : (
              <Pressable onPress={signIn} style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
              </Pressable>
        )}
  </View>
</SafeAreaView>
)
}

export default Login;