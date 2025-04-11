import { Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const editStyles = StyleSheet.create({
    editButton: {
        height: 28,
        width: 28,
        marginRight: 14
    }
})

const EditButton = ( {nav, target, params} ) => {
    return (
        <TouchableOpacity
        onPress={() => {
            nav.navigate(target, {...params});
        }}>
            <Image 
            style={editStyles.editButton}
            source={require('../../assets/edit.png')}
            />
        </TouchableOpacity>
    )
}

export default EditButton;