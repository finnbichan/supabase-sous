import { Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const backStyles = StyleSheet.create({
    backButton: {
        height: 32,
        width: 32
    }
})

const BackButton = ( {nav, route, params} ) => {
    const { assets } = useTheme();
    return (
        <TouchableOpacity
        onPress={() => {route.params?.prevScreen ? nav.navigate(route.params.prevScreen, params) : nav.goBack()}}
        >
            <Image 
            style={backStyles.backButton}
            source={assets.chevron_left}
            />
        </TouchableOpacity>
    )
}

export default BackButton;