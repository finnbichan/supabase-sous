import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, Platform, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import { useRoute } from '@react-navigation/native';
import Checkbox from '../components/Checkbox';
import DoneButton from '../components/DoneButton';
import { supabase } from '../../supabase';
import { useTheme } from '@react-navigation/native';

const List = ({navigation, route}) => {
    const [list, setList] = useState(route.params?.list || []);
    const [newListItem, setNewListItem] = useState('');
    const [listName, setListName] = useState(route.params?.list_name);
    const [submitting, setSubmitting] = useState(false);
    const { assets, colours } = useTheme();
    const styles = useStyles(); 
    const listStyles = StyleSheet.create({
        textInput: {
            width: '80%',
            marginLeft: 8,
            color: colours.text,
        },
        keyboardAvoider: {
             position: 'absolute',
             bottom: 0
        },
        inputContainer: {
            backgroundColor: colours.card,
            width: '100%', 
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
            marginLeft: 4,
            borderRadius: 4,
            height: 50,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'red'
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
            backgroundColor: colours.card,
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
            color: colours.text,
            fontSize: 18
        },
        checkboxContainer: {
            padding: 8
        }
    })

    const isNewList = true ? route.params?.list === undefined : false;

    console.log("is new list", isNewList)

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <DoneButton onSubmit={submitList} isSubmitting={submitting}/>
            )
            });
      }, [navigation, submitting, list, listName]);

    const onAddItem = () => {
        if (newListItem) {
            const newId = list.length;
            setList([...list, {id: newId, label: newListItem, checked: false}])
            setNewListItem('')
        }
    }

    const submitList = () => {
        setSubmitting(true)
        isNewList ? insertList() : updateList()
        setSubmitting(false)
    }

    const insertList =  async() => {
        console.log("data", list)
        const {data, error} = await supabase
        .from('lists')
        .insert([{
            list_name: listName || "Untitled List",
            list: list
            }])
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            const updateDate = Date.now()
            navigation.navigate('Shopping Lists', {prevScreen: "Home", action: updateDate})
        }
    }

    console.log("list", list ? true : false)       
    const updateList = async() => {
        console.log("data", list)
        const {data, error} = await supabase
        .from('lists')
        .update({
            list_name: listName || "Untitled List",
            list: list,
            last_updated_at: new Date()
        })
        .eq('id', route.params?.list_id)
        if (error) {
            console.log(error)
        }
        else {
            console.log(data)
            const updateDate = Date.now()
            navigation.navigate('Shopping Lists', {prevScreen: "Home", action: updateDate})
        }
    }

    const renderListItem = ({item}) => {
        
        const onItemTextChange = (text) => {
            const cpList = [...list]
            cpList[item.id].label = text
            setList(cpList)
        }
    
        const onItemCheck = () => {
            const cpList = [...list]
            cpList[item.id].checked = !cpList[item.id].checked
            setList(cpList)
        }

        return (
            <View style={item.checked ? {opacity: 0.5} : {opacity:1}}>
                <View style={listStyles.itemContainer}>
                    <View style={listStyles.leftItemContainer}>
                        <Image
                        style={listStyles.button}
                        source={assets.drag_handle}
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.content, {borderWidth: 1, borderColor: 'red'}]}>
                <View style={listStyles.titleContainer}>
                    <TextInput 
                    style={styles.title}
                    onChangeText={(text) => setListName(text)}
                    placeholder='Untitled List'
                    placeholderTextColor={colours.secondaryText}
                    >
                    {listName}
                    </TextInput>
                </View>
                {list.length ? (
                    <>
                        <FlatList
                        data={list.filter(val => val.checked === false)}
                        renderItem={renderListItem}
                        keyExtractor={item => item.id}
                        style={listStyles.itemList}
                        />
                        <FlatList
                        data={list.filter(val => val.checked === true)}
                        renderItem={renderListItem}
                        keyExtractor={item => item.id}
                        style={listStyles.itemList}
                        />
                    </>
                ) : (
                    <Text style={styles.lowImpactText}>Add some items!</Text>
                )}
            </View>
            <KeyboardAvoidingView
                style={listStyles.keyboardAvoider}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 1000}
            >
                <View style={listStyles.inputContainer}>
                    <TextInput 
                        style={listStyles.textInput}
                        placeholder="Add an item" 
                        placeholderTextColor={colours.secondaryText}
                        autoFocus={true}
                        onChangeText={(text) => setNewListItem(text)}
                        value={newListItem}
                    />
                    <TouchableOpacity onPress={onAddItem}>
                        <Image 
                            style={listStyles.button}
                            source={assets.add}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default List;