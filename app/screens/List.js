import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from '../styles/Common';
import { useRoute } from '@react-navigation/native';
import Checkbox from '../components/Checkbox';
import CollapsibleSection from '../components/CollapsibleSection';
const listStyles = StyleSheet.create({
    textInput: {
        width: '80%',
        marginLeft: 8,
        color: '#fff'
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
    },
    titleContainer: {
        alignItems: 'flex-start'
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#222222',
        borderRadius: 4,
        marginVertical: 2
    },
    leftItemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    itemList: {
        width: '100%'
    },
    itemText: {
        color: '#fff',
        fontSize: 18
    },
    checkboxContainer: {
        padding: 8
    }
})

const ListEmpty = () => {  
    return (<Text style={styles.lowImpactText}>Add some items!</Text>)
}

const List = ({navigation}) => {
    const route = useRoute();
    const [list, setList] = useState(route.params?.list || []);
    const [newListItem, setNewListItem] = useState('');
    const [listName, setListName] = useState(route.params?.list_name);


    const renderListItem = ({item}) => {
        const onItemTextChange = (text) => {
            const cpList = [...list]
            cpList[item.id].label = text
            setList(cpList)
        }
        const onItemCheck = () => {
            const cpList = [...list]
            console.log("before", cpList[item.id].checked, item.checked)
            cpList[item.id].checked = !cpList[item.id].checked
            console.log("after", cpList[item.id].checked, item.checked)
            setList(cpList)
        }
        console.log(item)
        return (
            <View style={item.checked ? {opacity: 0.5} : {opacity:1}}>
                <View style={listStyles.itemContainer}>
                    <View style={listStyles.leftItemContainer}>
                        <Image
                        style={listStyles.button}
                        source={require('../../assets/drag_handle.png')}
                        />
                        <TextInput 
                        style={listStyles.itemText} 
                        value={item.label} 
                        onChangeText={(text) => onItemTextChange(text)}
                        />
                    </View>
                    <View style={listStyles.checkboxContainer}>
                        <Checkbox
                        onPress={onItemCheck}
                        isChecked={item.checked}
                        />
                    </View>
                </View>
            </View>
        )
    }

    const onAddItem = () => {
        if (newListItem) {
            setList([...list, {id: list.length, label: newListItem, checked: false}])
            setNewListItem('')
            console.log(list)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={listStyles.titleContainer}>
                    <TextInput 
                    style={styles.title}
                    onChangeText={(text) => setListName(text)}
                    placeholder='Untitled List'
                    placeholderTextColor="#a9a9a9"
                    >
                    {listName}
                    </TextInput>
                </View>
                <FlatList
                data={list.filter(val => val.checked === false)}
                renderItem={renderListItem}
                ListEmptyComponent={ListEmpty}
                keyExtractor={item => item.id}
                style={listStyles.itemList}
                />
                <FlatList
                data={list.filter(val => val.checked === true)}
                renderItem={renderListItem}
                keyExtractor={item => item.id}
                style={listStyles.itemList}
                />
            </View>
            <KeyboardAvoidingView style={listStyles.inputContainer}>
                <TextInput 
                style={listStyles.textInput}
                placeholder="Add an item" 
                placeholderTextColor='#a9a9a9'
                autoFocus={true}
                onChangeText={(text) => setNewListItem(text)}
                value={newListItem}
                />
                <TouchableOpacity
                        onPress={onAddItem}
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