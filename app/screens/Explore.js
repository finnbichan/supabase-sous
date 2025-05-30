import { View, Text, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import Recipe from '../components/RecipeBase';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';
import { useTheme } from '@react-navigation/native';
import AppHeaderText from '../components/AppHeaderText';

const ExploreFooter = () => {
    const styles = useStyles();
    return (
        <View style={{alignItems: 'center', padding: 10}}>
            <Text style={styles.lowImpactText}>No more suggestions!</Text>
        </View>
    )
}

const Explore = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [recipes, setRecipes] = useState(undefined);
    const [likedRecipes, setLikedRecipes] = useState([]);
    const { colours, assets } = useTheme();
    const styles = useStyles();
    const exploreStyles = StyleSheet.create({
        container: {
            backgroundColor: colours.card,
            borderRadius: 8,
            paddingHorizontal: 10,
            marginTop: 4,
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    })

    const session = useContext(AuthContext);

    const getExploreRecipes = async (setState) => {
        console.log("fetching")
        const {data, error} = await supabase
        .rpc('explore_recipes', {p_user_id: session.user.id, already_on_page: [0]})
        if (error) {
            console.log(error)
        } else {
            console.log("the data", data)
            setRecipes(data)   
        }
        setState(false)
    }

    useEffect(() => {
        setLoading(true)
        getExploreRecipes(setLoading);       
    }, [])

    const onRefresh = () => {
        setRefreshing(true);
        getExploreRecipes(setRefreshing);
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
                        <Image source={assets.heart} style={{width: 20, height: 20, margin: 10}} />
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
                    ListHeaderComponent={<AppHeaderText>Explore</AppHeaderText>}
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