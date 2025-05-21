import { Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';

const textStyles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto',
        fontSize: 16,
        marginLeft: 14,
        marginVertical: 8,
        alignSelf: 'flex-start',
    }
})

const AppText = ( {children} ) => {
    const { colours } = useTheme();
    return (
        <Text style={[textStyles.text, {color: colours.text}]}>{children}</Text>
    )
}

export default AppText;