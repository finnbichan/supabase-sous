import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useStyles from '../styles/Common';

const MealPlanSummary = ({ breakfast, lunch, dinner }) => {
    const styles = useStyles();
    const breakfaststring = breakfast ? breakfast.name : "No breakfast"
    const lunchstring = lunch ? lunch.name : "no lunch"
    const dinnerstring = dinner ? dinner.name : "no dinner"
    return (
        <Text style={styles.lowImpactText}>{breakfaststring}, {lunchstring}, {dinnerstring}</Text>
    );
};



export default MealPlanSummary;