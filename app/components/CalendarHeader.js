import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Dropdown from './Dropdown';
import { styles } from '../styles/Common';
import { AuthContext } from '../../Contexts';

const CalendarHeader = ( { dateArray } ) => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const session = useContext(AuthContext);
    const time = Number((new Date).getHours());
    var greeting = "Hey";
    if (0 <= time < 12) {greeting = "Morning"}
    else if (12 <= time < 18) {greeting = "Afternoon"}
    else {greeting = "Evening"};
    
    return (
            <View style={headerStyles.container}>
                <Text style={styles.title}>{greeting} {session.user.user_metadata.display_name}!</Text>
                <TouchableOpacity style={headerStyles.shoppingButton}>
                    <Text style={headerStyles.shoppingButtonText}>Shopping Lists</Text>
                </TouchableOpacity>
            </View>
    );
};

const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    greeting: {
        fontSize: 20,
        marginBottom: 10,
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