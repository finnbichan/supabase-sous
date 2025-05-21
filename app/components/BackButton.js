import { Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const backStyles = StyleSheet.create({
    backButton: {
        height: 50,
        width: 50
    }
})

const BackButton = ( {nav} ) => {
    const { assets } = useTheme();
    return (
        <TouchableOpacity
        onPress={() => {
            nav.goBack();
        }}>
            <Image 
            style={backStyles.backButton}
            source={assets.chevron_left}
            />
        </TouchableOpacity>
    )
}

export default BackButton;