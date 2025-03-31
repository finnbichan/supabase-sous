import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    editButton: {
        height: 32,
        width: 32,
        marginRight: 10
    }
})

const AddHeaderButton = ( { navigation, target, prevScreen} ) => {
    return (
        <TouchableOpacity
        onPress={()=>{navigation.navigate(target, {prevScreen: prevScreen})}}
        >
            <Image 
            style={styles.editButton}
            source={require('../../assets/add.png')}
            />
        </TouchableOpacity>
    )
}

export default AddHeaderButton;