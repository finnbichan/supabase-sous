import { View, Text, Pressable, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';
import Dropdown from '../components/Dropdown';


const NewUser = ( {navigation} ) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [availableCountries, setAvailableCountries] = useState('');
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCountries = async () => {
      await (supabase.from('countries').select('id,country_code,country_name'))
      .then((data) => {
        const parsedForDropdown = data.data.map((item) => {
          return {
            id: item.id,
            label: item.country_name,
            code: item.country_code
          }
        })
        setAvailableCountries(parsedForDropdown)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setCountriesLoading(false);
      })
    }
    getCountries()
  }, [])

  
  const signUp = async () => {
    setLoading(true);
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        data: {
          display_name: name,
          region: country.code
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to sous!</Text>
        <Text style={styles.text}>We need a few details from you to get started.</Text>
        <TouchableOpacity 
        onPress={() => {navigation.navigate("Login")}}
        style={styles.button}
        >
          <Text
          style={styles.buttonText}
          >
            Been here before?
          </Text>
        </TouchableOpacity>
        <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a9a9a9"
        onChangeText={(text) => setEmail(text)}
        />
        <TextInput
        style={styles.input}
        placeholder='Display Name'
        placeholderTextColor="#a9a9a9"
        onChangeText={(text) => setName(text)}
        />
        {countriesLoading ? (
        <ActivityIndicator />
        ) : (
        <Dropdown
          data={availableCountries}
          label="Region"
          onSelect={setCountry}
          />
        )
        }
        <Text style={styles.text}>We don't use passwords here - when you click sign up, we'll send a one time password to your email address.</Text>
        {loading ? <ActivityIndicator /> : (
        <TouchableOpacity 
        onPress={signUp}
        style={styles.button}
        >
          <Text
          style={styles.buttonText}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        )}
  </View>
</SafeAreaView>
)
}

export default NewUser;