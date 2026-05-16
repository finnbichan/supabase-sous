import { SafeAreaView, View, Text } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import AppHeaderText from '../components/AppHeaderText';
import FloatingDrawerButton from '../components/FloatingDrawerButton';

const Profile = () => {
    const styles = useStyles();

    return (
        <SafeAreaView style={styles.container}>
            <FloatingDrawerButton />
            <View style={[styles.content, { width: '100%', alignItems: 'flex-start', paddingHorizontal: 8, paddingTop: 10 }]}>
                <AppHeaderText>Profile</AppHeaderText>
                <Text style={[styles.lowImpactText, { marginTop: 8 }]}>Profile page placeholder.</Text>
            </View>
        </SafeAreaView>
    );
};

export default Profile;
