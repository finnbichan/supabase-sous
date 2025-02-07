import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MealPlanSummary = ({ breakfast, lunch, dinner }) => {
    const breakfaststring = breakfast ? breakfast.name : "No breakfast"
    const lunchstring = lunch ? lunch.name : "no lunch"
    const dinnerstring = dinner ? dinner.name : "no dinner"
    return (
        <Text style={styles.lowImpactText}>{breakfaststring}, {lunchstring}, {dinnerstring}</Text>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    lowImpactText: {
        color: '#b3b3b3'
    }
});

export default MealPlanSummary;