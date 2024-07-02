import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/Recipe';
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
        const recipes = recipesData.data.map((item) => {
            return {
              id: item.id,
              name: item.recipe_name,
              ease: item.ease,
              cuisine: item.cuisine,
              diet: item.diet
            }})
        setRecipes(recipes)
        setLoading(false)
        }
        getRecipes()
    }, [recipeAdded])

    const renderRecipe = ({item}) => {
        return (
            <View>

                <Recipe
                name={item.name}
                ease={item.ease}
                cuisine={item.cuisine}
                diet={item.diet}
                />
                
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {showAddedNotif ? (
                    <Text>Recipe added successfully!</Text>
                ) : (
                    <></>
                )}
                <Text>Here are your recipes</Text>
                <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                    navigation.navigate("Add a recipe");
                }}
                ><Text style={styles.buttonText}>Add another one</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <>
                    <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={item => item.id}
                    extraData={loading}
                    />
                    </>
                )}
            </View>
        </SafeAreaView>
    )
}

export default UserRecipes;