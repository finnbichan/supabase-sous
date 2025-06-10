import { Text } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const headerStyles = StyleSheet.create({
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 8,
        marginTop: 2,
        marginBottom: 2,
        textAlign: 'left',
        alignSelf: 'flex-start',
    }
})

const AppHeaderText = ( {children} ) => {
    const { colours } = useTheme();
    return (
        <Text style={[headerStyles.header, {color: colours.text }]}>{children}</Text>
    )
}

export default AppHeaderText;