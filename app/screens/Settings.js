import { supabase } from '../../supabase';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import FloatingDrawerButton from '../components/FloatingDrawerButton';

const Settings = () => {
    function logOut() {
        supabase.auth.signOut();
    }
    const styles = useStyles();
    return (
        <SafeAreaView style={styles.container}>
            <FloatingDrawerButton />
            <View style={styles.content}>
                <Pressable onPress={logOut} style={styles.logOutButton}>
                    <Text style={styles.buttonText}>Log out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Settings;
