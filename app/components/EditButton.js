import { Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const editStyles = StyleSheet.create({
    editButton: {
        height: 28,
        width: 28,
        marginRight: 14
    }
})

const EditButton = ( {nav, target, params} ) => {
    const { assets } = useTheme();
    return (
        <TouchableOpacity
        onPress={() => {
            nav.navigate(target, {...params});
        }}>
            <Image 
            style={editStyles.editButton}
            source={assets.edit}
            />
        </TouchableOpacity>
    )
}

export default EditButton;