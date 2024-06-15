import { View, Text, Pressable, SafeAreaView } from 'react-native';
import React from 'react';


const Loading =  () => {
    console.log("loading")
    return (
        <SafeAreaView style={styles.container}>
            <Text>Loading</Text>
        </SafeAreaView>
    )
}

export default Loading;