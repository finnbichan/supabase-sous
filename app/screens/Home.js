import { View, Text, Pressable, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import Calendar from '../components/Calendar';
import { styles } from '../styles/Common';

const Home = () => {
    const [dataLoading, setDataLoading] = useState(true)
    const [cuisines, setCuisines] = useState('');

    useEffect(() => {
        const getCuisines = async () => {
          await (supabase.from('cuisines').select('id, desc')).eq('status', true)
          .then((data) => {
            if(data.error){
                throw new Error(data.error);
            }
            const parsedForDropdown = data.data.map((item) => {
              return {
                id: item.id,
                label: item.desc
              }
            });
            console.log(parsedForDropdown)
            setCuisines(parsedForDropdown);
            console.log(cuisines);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setDataLoading(false);
          })
        }
        getCuisines();
      }, [])
    
    return (
        <SafeAreaView>
            <View>
                <Text>You're in</Text>
            </View>
        </SafeAreaView>
    )
}

export default Home;