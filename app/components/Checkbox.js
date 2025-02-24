import { Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

const checkboxStyles = StyleSheet.create({
    icon: {
        height: 32,
        width: 32
    }
})

const Checkbox = ( {onPress} ) => {
    const [checked, setChecked] = useState(false);
    const toggleChecked = () => {
        setChecked(!checked);
    }
    const onCheckboxPress = () => {
        onPress();
        toggleChecked();
    }
    return (
        checked ? (
            <TouchableOpacity
            onPress={onCheckboxPress}>
                <Image 
                style={checkboxStyles.icon}
                source={require('../../assets/check_box.png')}
                />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
            onPress={onCheckboxPress}>
                <Image 
                style={checkboxStyles.icon}
                source={require('../../assets/check_box_outline.png')}
                />
            </TouchableOpacity>
        )
    )
}

export default Checkbox;