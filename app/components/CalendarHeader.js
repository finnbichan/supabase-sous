import React, { useState, useContext, use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../Contexts';
import AppHeaderText from './AppHeaderText';
import useStyles from '../styles/Common';

const CalendarHeader = () => {
    const styles = useStyles();
    const session = useContext(AuthContext);
    const time = Number((new Date).getHours());
    var greeting = "Hey";
    if (time < 12) {greeting = "Morning"}
    else if (time >= 18) {greeting = "Evening"}
    else {greeting = "Afternoon"};
    
    return (
            <View style={headerStyles.container}>
                <AppHeaderText>{greeting}, {session.user.user_metadata.display_name}</AppHeaderText>
            </View>
    );
}; 

const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    greeting: {
        fontSize: 20,
        marginBottom: 10
    },
    shoppingButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    shoppingButtonText: {
        color: '#000',
    },
    instructionText: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    picker: {
        flex: 1,
        height: 50,
    },
});

export default CalendarHeader;