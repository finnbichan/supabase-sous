import { Image, TouchableOpacity, View, TextInput } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { styles } from '../styles/Common';

const noPlanStyles = StyleSheet.create({
    box: {
        backgroundColor: "#222222",
        borderRadius: 4,
        padding: 4,
        margin: 1,
        flexDirection: 'row',
        flexGrow: 1
    },
    image: {
        height: 50,
        width: 50
    }
})

const NoPlan = () => {
    return (
        <View style={noPlanStyles.box}>
            
            <TextInput
            style={styles.input}
            placeholder="Search"
            placeholderTextColor={'#a9a9a9'}
            />
            <TouchableOpacity>
                <Image
                style={noPlanStyles.image}
                source={require('../../assets/bolt.png')}
                />
            </TouchableOpacity>
        </View>
    )
}

export default NoPlan;