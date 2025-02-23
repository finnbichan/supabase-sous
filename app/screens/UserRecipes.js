import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';

const RecipesHeader = ({navigation}) => {
    return (   
        <View style={styles.userRecipesTitleBox}>
                    <Text style={styles.title}>Your recipes</Text>
                    <TouchableOpacity
                    onPress={()=>{
                        navigation.navigate("Add a recipe", {prevScreen: "Your recipes"});
                    }}
                    >
                        <Image 
                        style={styles.addButton}
                        source={require('../../assets/add.png')}
                        />
                    </TouchableOpacity>
                </View>
    )
}

const ListEmpty = () => {  
    return (
        <View>
            <Text style={styles.lowImpactText}>No recipes yet! Click + to add your own or head over the Explore page for inspiration!</Text>
        </View>
    )
}

const UserRecipes = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState(undefined);
    const session = useContext(AuthContext)

    const getRecipes = async () => {
        console.log("fetching")
        const {data, error} = await supabase
        .rpc('get_user_recipes', {p_user_id: session.user.id})
        if (error) {
            console.log(error)
            return
        } else {
            console.log(data)
            setRecipes(data)
        }
    }

    useEffect(() => {
        setLoading(true)
        getRecipes()
        setLoading(false)
    }, [route.params?.action])

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
                    keyExtractor={item => item.id}
                    extraData={loading}
                    style={styles.recipeList}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<RecipesHeader navigation={navigation} />}
                    ListEmptyComponent={<ListEmpty />}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default UserRecipes;