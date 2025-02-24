import { Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

const checkboxStyles = StyleSheet.create({
    icon: {
        height: 32,
        width: 32
    }
})

const Checkbox = ( {onPress, isChecked} ) => {
    console.log("inside", isChecked)
    const toggleChecked = () => {
        onPress();
    }
    return (
        isChecked ? (
            <TouchableOpacity
            onPress={toggleChecked}>
                <Image 
                style={checkboxStyles.icon}
                source={require('../../assets/check_box.png')}
                />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
            onPress={toggleChecked}>
                <Image 
                style={checkboxStyles.icon}
                source={require('../../assets/check_box_outline.png')}
                />
            </TouchableOpacity>
        )
    )
}

export default Checkbox;