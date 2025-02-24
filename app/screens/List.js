import { View, Text, TextInput, SafeAreaView, TouchableOpacity,ActivityIndicator, Image, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';
import { useRoute } from '@react-navigation/native';

const listStyles = StyleSheet.create({
    textInput: {
        width: '80%',
        marginLeft: 8
    },
    inputContainer: {
        backgroundColor: '#222222',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginLeft: 4,
        borderRadius: 4,
        height: 50,
        alignItems: 'center'
    },
    button: {
        height: 32,
        width: 32,
        marginHorizontal: 8
    }
})

const ListEmpty = () => {  
    return (<Text style={styles.lowImpactText}>Add some items!</Text>)
}

const List = ({navigation, list}) => {
    const route = useRoute();
    const [lists, setLists] = useState(route.params?.list);

    const renderListItem = ({item}) => {
        return (
            <View>
                
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                    <FlatList
                    data={lists}
                    renderItem={renderListItem}
                    ListEmptyComponent={ListEmpty}
                    />
            </View>
            <KeyboardAvoidingView style={listStyles.inputContainer}>
                <TextInput 
                style={listStyles.textInput}
                placeholder="Add an item" 
                placeholderTextColor={'#fff'}
                />
                <TouchableOpacity
                        onPress={()=>{console.log("go stoopid go crazy")}}
                        >
                            <Image 
                            style={listStyles.button}
                            source={require('../../assets/add.png')}
                            />
                        </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default List;