import { View, Text, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeBase';
import { supabase } from '../../supabase';

const exploreStyles = StyleSheet.create({
    container: {
        backgroundColor: '#222222',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

const Explore = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState(undefined);

    useEffect(() => {
        setLoading(true)
        const getRecipes = async () => {
        console.log("fetching")
        const recipesData = await supabase
        .from('recipes')
        .select()
        .limit(10)
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
    }, [route.params?.action])

    const renderRecipe = ({item}) => {
        return (
            <View style={exploreStyles.container}>
                    <Recipe
                    recipe={item}
                    />
                    <TouchableOpacity
                    onPress={()=>{console.log("hearted")}}
                    >
                        <Image source={require('../../assets/heart.png')} style={{width: 20, height: 20, margin: 10}} />
                    </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
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

export default Explore;