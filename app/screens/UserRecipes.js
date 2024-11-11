import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeOverview';
import { supabase } from '../../supabase';
import { useIsFocused } from '@react-navigation/native';

const UserRecipes = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState(undefined);
    const [recipeAdded, setRecipeAdded] = useState(null);
    const [showAddedNotif, setShowAddedNotif] = useState(null);
    
    const isFocused = useIsFocused();

    function removeAddedNotif() {
        setShowAddedNotif(null);
    }

    useEffect(() => {
        if(route.params?.added){
            setRecipeAdded(true)
            setShowAddedNotif(true)
            setTimeout(removeAddedNotif, 2000);
            }
    }, [isFocused])
    
    useEffect(() => {
        getRecipes = async () => {
        console.log("fetching")
        const userData = await supabase.auth.getUser()
        const recipesData = await supabase
        .from('recipes')
        .select()
        .eq('user_id', userData.data.user.id)
        .order('recipe_name')
        const recipes = recipesData.data.map((item) => {
            return {
              id: item.id,
              name: item.recipe_name,
              ease: item.ease,
              cuisine: item.cuisine,
              diet: item.diet
            }})
        console.log(recipes)
        setRecipes(recipes)
        setLoading(false)
        }
        getRecipes()
    }, [recipeAdded])

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
                {showAddedNotif ? (
                    <Text style={styles.text}>Recipe added successfully!</Text>
                ) : (
                    <></>
                )}
                <View style={styles.userRecipesTitleBox}>
                    <Text style={styles.title}>Recipes</Text>
                    <TouchableOpacity
                    onPress={()=>{
                        navigation.navigate("Add a recipe");
                    }}
                    >
                        <Image 
                        style={styles.addButton}
                        source={require('../../assets/add_box.png')}
                        />
                    </TouchableOpacity>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={item => item.id}
                    extraData={loading}
                    style={styles.recipeList}
                    showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default UserRecipes;