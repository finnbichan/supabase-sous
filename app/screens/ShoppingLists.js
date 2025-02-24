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

const ListHeader = ({navigation}) => {

    return (
    <View style={styles.userRecipesTitleBox}>
        <Text style={styles.title}>Your shopping lists</Text>
        <TouchableOpacity
        onPress={()=>{navigation.navigate("List", {prevScreen: "Shopping Lists"})}}
        >
            <Image 
            style={styles.addButton}
            source={require('../../assets/add.png')}
            />
        </TouchableOpacity>
    </View>
    )
}

const ShoppingLists = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [lists, setLists] = useState(undefined);

    const session = useContext(AuthContext)

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
    }, [])

    const renderList = ({item}) => {
        return (
            <View>
                <Recipe
                recipe={item}
                navigation={navigation}
                />
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
                    ListHeaderComponent={<ListHeader navigation={navigation}/>}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default ShoppingLists;