import React, {useState} from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Dropdown from './Dropdown';
import { styles } from '../styles/Common';

const CalendarHeader = ( { dateArray } ) => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    
    console.log("inside", dateArray); 
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Hello, User!</Text> 
                <TouchableOpacity style={headerStyles.shoppingButton}>
                    <Text style={headerStyles.shoppingButtonText}>Shopping Lists</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>Generate a meal plan from</Text>
                <Dropdown
                    data={dateArray}
                    label="Select an option..."
                    onSelect={(selected) => {setStartDate(selected)}}
                    value={startDate}
                />
                <Text style={styles.text}>to</Text>
                <Dropdown
                    data={dateArray}
                    label="Select an option..."
                    onSelect={(selected) => {setEndDate(selected)}}
                    value={endDate}
                />

            <TouchableOpacity styles={styles.button} onPress={() => { /* Handle Go button press */ }}>
                <Text style={styles.buttonText}>Go</Text>
            </TouchableOpacity>

        </View>
    );
};

const headerStyles = StyleSheet.create({
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