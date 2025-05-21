import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const styles = StyleSheet.create({
    editButton: {
        height: 32,
        width: 32,
        marginRight: 10
    }
})

const RightHeaderButton = ( { navigation, icon, target, prevScreen} ) => {
    const { assets } = useTheme();
    var iconPath = null;
    switch (icon) {
        case 'add':
            iconPath = assets.add;
            break;
        case 'list':
            iconPath = assets.list;
            break;
        default:
            iconPath = assets.add;
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