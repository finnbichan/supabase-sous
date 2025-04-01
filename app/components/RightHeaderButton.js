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

const RightHeaderButton = ( { navigation, icon, target, prevScreen} ) => {
    var iconPath = null;
    switch (icon) {
        case 'add':
            iconPath = require('../../assets/add.png');
            break;
        case 'list':
            iconPath = require('../../assets/list.png');
            break;
        default:
            iconPath = require('../../assets/add.png');
    }
    return (
        <TouchableOpacity
        onPress={()=>{navigation.navigate(target, {prevScreen: prevScreen})}}
        >
            <Image 
            style={styles.editButton}
            source={iconPath}
            />
        </TouchableOpacity>
    )
}

export default RightHeaderButton;