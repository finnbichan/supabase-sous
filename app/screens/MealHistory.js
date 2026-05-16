import { SafeAreaView, View, Text } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import AppHeaderText from '../components/AppHeaderText';
import FloatingDrawerButton from '../components/FloatingDrawerButton';

const MealHistory = () => {
    const styles = useStyles();

    return (
        <SafeAreaView style={styles.container}>
            <FloatingDrawerButton />
            <View style={[styles.content, { width: '100%', alignItems: 'flex-start', paddingHorizontal: 8, paddingTop: 10 }]}>
                <AppHeaderText>Meal History</AppHeaderText>
                <Text style={[styles.lowImpactText, { marginTop: 8 }]}>Meal history page placeholder.</Text>
            </View>
        </SafeAreaView>
    );
};

export default MealHistory;
