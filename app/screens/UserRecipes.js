import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/Recipe';

const UserRecipes = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState(undefined);

    const recipeAdded = route.params?.added;

    const auth = getAuth();
    const user = auth.currentUser;

    const queryUserRecipes = query(collection(firebase_db, "recipes"), where("user", "==", user.uid))

    firebaseRecipes = [];

    async function getAllUserRecipes() {
        const userRecipes = await getDocs(queryUserRecipes);
        userRecipes.forEach(doc => {
            firebaseRecipes.push({"id": doc.id, "recipe":doc.data()});
        })
        setRecipes(firebaseRecipes);
    }

    useEffect(() => {
        getAllUserRecipes()
        .then(() => {
        })
        .finally(() => {
            setLoading(false);
        })
    }, [recipeAdded])

    const renderRecipe = ({item}) => {
        return (
            <View>
                <Recipe
                name={item.recipe.name}
                cuisine={item.recipe.cuisine}
                ease={item.recipe.ease}
                diet={item.recipe.diet}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {recipeAdded ? (
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