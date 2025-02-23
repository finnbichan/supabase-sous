import { View, Text, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { styles } from '../styles/Common';
import Recipe from '../components/RecipeBase';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';

const exploreStyles = StyleSheet.create({
    container: {
        backgroundColor: '#222222',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 4,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listFooter: {
        alignItems: 'center',
        padding: 10
    }
})

const ExploreHeader = () => {
    return (
         <View style={styles.userRecipesTitleBox}>
            <Text style={styles.title}>Explore</Text>
        </View>
    )
}

const ExploreFooter = () => {
    return (
        <View style={exploreStyles.listFooter}>
            <Text style={styles.lowImpactText}>No more suggestions!</Text>
        </View>
    )
}

const Explore = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [recipes, setRecipes] = useState(undefined);
    const [likedRecipes, setLikedRecipes] = useState([]);

    const session = useContext(AuthContext);

    const getExploreRecipes = async () => {
        console.log("fetching")
        const {data, error} = await supabase
        .rpc('explore_recipes', {p_user_id: session.user.id, already_on_page: [0]})
        if (error) {
            console.log(error)
            return
        } else {
            console.log("the data", data)
            setRecipes(data)
        }
    }

    useEffect(() => {
        setLoading(true)
        getExploreRecipes();  
        setLoading(false)      
    }, [])

    const onRefresh = () => {
        setRefreshing(true)
        getExploreRecipes();
        setRefreshing(false);
    }

    const likeRecipe = async (recipe_id) => {
        setLikedRecipes([...likedRecipes, recipe_id])
        console.log(likedRecipes)
        console.log("hearted")
    };


    const renderRecipe = ({item}) => {
        return (
            <View style={exploreStyles.container}>
                    <Recipe
                    recipe={item}
                    />
                    <TouchableOpacity
                    onPress={() => {likeRecipe(item.id)}}
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
                    ListHeaderComponent={<ExploreHeader />}
                    ListFooterComponent={<ExploreFooter />}
                    onRefresh={() => onRefresh()}
                    refreshing={refreshing}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default Explore;