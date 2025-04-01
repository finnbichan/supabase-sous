import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';

const listViewStyles = {
    list: {
        minWidth: "95%",
        marginBottom: -5
    },
    listItem: {
        backgroundColor: "#222222",
        borderRadius: 4,
        padding: 4,
        margin: 1,
        flexDirection: 'row',
        flexGrow: 1,
        maxWidth: '99%',
        marginBottom: 2,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: "#fff",
        fontSize: 18
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    chevron: {
        maxHeight: 30,
        maxWidth: 30
    }
}

const ListEmpty = () => {  
    return (
        <View>
            <Text style={styles.lowImpactText}>No shopping lists. Click + to add one.</Text>
        </View>
    )
}

const ListHeader = () => {
    return (
    <View style={styles.userRecipesTitleBox}>
        <Text style={styles.title}>Your shopping lists</Text>
    </View>
    )
}

const ShoppingLists = ({navigation, route}) => {
    const [loading, setLoading] = useState(true);
    const [lists, setLists] = useState(undefined);
    const [action, setAction] = useState(route.params?.action);

    const session = useContext(AuthContext)

    console.log("action", route.params?.action)
    const getLists = async () => {
        console.log("fetching")
        const {data, error} = await supabase
        .from('lists')
        .select('*')
        .eq('user_id', session.user.id)
        .order('last_updated_at', {ascending: false})
        if (error) {
            console.log(error)
        } else {
            console.log(data)
            setLists(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        getLists()
    }, [route.params?.action])

    const renderList = ({item}) => {
        const dateString = new Date(item.last_updated_at).toDateString().slice(0,10);
        const timeString = new Date(item.last_updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        return (
            <TouchableOpacity
            style={listViewStyles.listItem}
            onPress={() => navigation.navigate('List', {list_id: item.id, list: item.list, list_name: item.list_name, prevScreen: "Shopping Lists"})}
            >
                <View>
                    <Text style={listViewStyles.text}>{item.list_name}</Text>
                    <Text style={styles.lowImpactText}>Last updated {timeString}, {dateString}</Text>
                </View>
                <View style={listViewStyles.buttonSection}> 
                    <Image 
                    style={listViewStyles.chevron}
                    source={require('../../assets/chevron_right.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator/>
                ) : (
                    <FlatList
                    style={listViewStyles.list}
                    data={lists}
                    renderItem={renderList}
                    ListEmptyComponent={ListEmpty}
                    ListHeaderComponent={<ListHeader/>}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default ShoppingLists;