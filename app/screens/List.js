import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, Platform, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
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
            //marginBottom: 4,
            //marginLeft: 4,
            //borderRadius: 4,
            height: 50,
            alignItems: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colours.layer
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
    }

    const insertList =  async() => {
        console.log("data", submitting)
        const {data, error} = await supabase
        .from('lists')
        .insert([{
            list_name: listName || "Untitled List",
            list: list
            }])
        if (error) {
            console.log(error)
            setSubmitting(false)
        } else {
            console.log(data)
            const updateDate = Date.now()
            setSubmitting(false)
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
            setSubmitting(false)
        }
        else {
            console.log(data)
            const updateDate = Date.now()
            setSubmitting(false)
            navigation.navigate('Shopping Lists', {prevScreen: "Home", action: updateDate})
            
        }
        
    }

    const ListItem = ({item}) => {
        
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
            <View style={{height: '100%'}}>
                <ScrollView contentContainerStyle={{justifyContent: 'center', alignItems: 'center', marginBottom: 4}}>
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
                            {list.filter(val => val.checked === false).map((x, i) => {
                                return (
                                    <ListItem
                                    item={x}
                                    key={i}
                                    />
                                )
                            })}
                            {list.filter(val => val.checked === true).map((x, i) => {
                                return (
                                    <ListItem
                                    item={x}
                                    key={i}
                                    />
                                )
                            })}
                            
                            
                        </>
                    ) : (
                        <Text style={styles.lowImpactText}>Add some items!</Text>
                    )}
                </ScrollView>
            <KeyboardAvoidingView
            //style={listStyles.keyboardAvoider}
            behavior='padding'
            keyboardVerticalOffset='106'
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
            </View>
        </SafeAreaView>
    )
}

export default List;