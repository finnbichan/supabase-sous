import { View, Text, Pressable, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../supabase';
import Calendar from '../components/Calendar';
import useStyles from '../styles/Common';
import { AuthContext } from '../../Contexts';

const Home = ({navigation}) => {
    const [name, setName] = useState('');
    const [dataLoading, setDataLoading] = useState(true)
    const styles = useStyles();
    const session = useContext(AuthContext);

    useEffect(()=> {
      const getUserName = async () => {
        const nameData = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', session.user.id);
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