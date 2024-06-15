import { supabase } from '../../supabase';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import React from 'react';
import Calendar from '../components/Calendar';
import { styles } from '../styles/Common';

const Settings = () => {
    function logOut() {
        supabase.auth.signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Pressable onPress={logOut} style={styles.logOutButton}>
                    <Text style={styles.buttonText}>Log out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Settings;