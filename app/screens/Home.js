import { View, Text, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import Calendar from '../components/Calendar';
import { styles } from '../styles/Common';

const Home = ({navigation}) => {
    const [name, setName] = useState('');
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(()=> {
      getUserName = async () => {
        const userData = await supabase.auth.getUser();
        const nameData = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userData.data.user.id);
        setName(nameData.data[0].display_name);
        console.log(name);
      }
      getUserName();
    })
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Calendar 
                navigation={navigation}
                />
            </View>
        </SafeAreaView>
    )
}

export default Home;