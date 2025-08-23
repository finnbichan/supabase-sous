import { View, Text, SafeAreaView, ActivityIndicator, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { AuthContext, CacheContext } from '../../Contexts';
import AppHeaderText from '../components/AppHeaderText';
import RightHeaderButton from '../components/RightHeaderButton';
import { useTheme } from '@react-navigation/native';


const ListEmpty = () => {  
    return (
        <View>
            <Text style={styles.lowImpactText}>No recipes yet! Click + to add your own or head over the Explore page for inspiration!</Text>
        </View>
    )
}

const ListHeader = ({navigation}) => {
    const {assets, colours} = useTheme();
    const styles = useStyles();
    return (
    <View style={{width: '100%', paddingLeft: 8}}>
        <View style={{paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <AppHeaderText>Your recipes</AppHeaderText>
            <View style={{flexDirection: 'row'}}>
                <RightHeaderButton navigation={navigation} target="Add a recipe" prevScreen="Recipes"/>
            </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10}}>
            <TextInput
            style={{paddingHorizontal: 10, backgroundColor: colours.card, flexGrow: 1, borderRadius: 8, marginRight: 16, color: colours.text, alignContent: 'center'}}
            placeholder="Search"
            placeholderTextColor={colours.secondaryText}
            />
            <TouchableOpacity
                style={{marginRight: 16}}>
                    <Image
                    source={assets.filter}
                    style={styles.icon}
                    />
                </TouchableOpacity>
        </View>
    </View>
    )
}

const UserRecipes = ({route, navigation}) => {
    const {cache, setCache} = useContext(CacheContext)
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState(undefined);
    const session = useContext(AuthContext)
    const styles = useStyles();

    const getRecipes = async () => {
        console.log("fetching")
        const {data, error} = await supabase
        .rpc('get_user_recipes', {p_user_id: session.user.id})
        if (error) {
            console.log("error", error)
            return
        } else {
            setRecipes(data)
            setLoading(false)
        }
    }

    useEffect(() => {
        getRecipes()
    }, [cache])

    const renderRecipe = ({item}) => {
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
                <ListHeader navigation={navigation}/>
                {loading ? (
                    <ActivityIndicator/>
                ) : (
                    <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={item => item.recipe_id}
                    extraData={loading}
                    style={styles.recipeList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<ListEmpty />}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default UserRecipes;