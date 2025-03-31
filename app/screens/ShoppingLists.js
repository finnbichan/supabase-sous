import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';

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
        return (
            <View>
                <Text style={styles.text}>{item.list_name}</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator/>
                ) : (
                    <FlatList
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