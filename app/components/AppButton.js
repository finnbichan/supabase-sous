import { TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';


const AppButton = ( {onPress, label, disabled = false} ) => {
    const { colours } = useTheme();
    
    const appButtonStyles = StyleSheet.create({
        button: {
            width: '95%',
            height: 40,
            backgroundColor: '#00AEFF',
            borderRadius: 4,
            justifyContent: 'center',
            alignContent: 'center',
            marginVertical: 8,
        },
        buttonDisabled: {
            opacity: 0.5
        },
        text: {
            color: '#FFF',
            fontSize: 16,
            textAlign: 'center',
        }
    })

    
    return (
        <TouchableOpacity onPress={onPress} style={[appButtonStyles.button, disabled && appButtonStyles.buttonDisabled]} disabled={disabled}>
            <Text style={appButtonStyles.text}>{label}</Text>
        </TouchableOpacity>
    )
}

export default AppButton;
