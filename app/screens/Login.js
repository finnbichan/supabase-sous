import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView} from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const {
      data: { session },
      error
    } = await supabase.auth.signUp({
      email: email, 
      password: password
  })

    if (error) {console.log(error)}
    setLoading(false);
  } 
  const signIn = async () => {
    setLoading(true);
    const {
      data: { session },
      error
    } = await supabase.auth.signInWithPassword({
      email: email, 
      password: password
    })

    if (error) {console.log(error)}
    setLoading(false);
    }

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to sous!</Text>
        <Text> Sign up or login to get started</Text>
        <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#a9a9a9"
        onChangeText={(text) => setEmail(text)}
        />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a9a9a9"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        />
        { loading ? <ActivityIndicator size="medium"/>
        : 
        <View style={styles.buttonsParent} >
            <View style={styles.buttonParent}>
              <Text style={styles.helperText}>First time?</Text>
              <Pressable onPress={signUp} style={styles.button}>
                  <Text style={styles.buttonText}>Sign up</Text>
              </Pressable>
            </View>
            <View style={styles.buttonParent}>
              <Text style={styles.helperText}>Been here before?</Text>
              <Pressable onPress={signIn} style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
              </Pressable>
            </ View>
          </ View>
        }
  </View>
</SafeAreaView>
)
}

export default Login;