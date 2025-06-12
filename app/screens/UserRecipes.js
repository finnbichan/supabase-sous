import { View, Text, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { AuthContext, CacheContext } from '../../Contexts';
import AppHeaderText from '../components/AppHeaderText';

const ListEmpty = () => {  
    return (
        <View>
            <Text style={styles.lowImpactText}>No recipes yet! Click + to add your own or head over the Explore page for inspiration!</Text>
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
                    ListHeaderComponent={<AppHeaderText>Your recipes</AppHeaderText>}
                    ListEmptyComponent={<ListEmpty />}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default UserRecipes;