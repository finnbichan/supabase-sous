import { Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const checkboxStyles = StyleSheet.create({
    icon: {
        height: 32,
        width: 32
    }
})

const Checkbox = ( {onPress, isChecked} ) => {
    const { assets } = useTheme();

    const toggleChecked = () => {
        onPress();
    }
    return (
        isChecked ? (
            <TouchableOpacity
            onPress={toggleChecked}>
                <Image 
                style={checkboxStyles.icon}
                source={assets.check_box}
                />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
            onPress={toggleChecked}>
                <Image 
                style={checkboxStyles.icon}
                source={assets.check_box_outline}
                />
            </TouchableOpacity>
        )
    )
}

export default Checkbox;