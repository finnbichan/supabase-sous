import { View, Text, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import Recipe from '../components/RecipeBase';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';
import { useTheme } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const ExploreFooter = () => {
    const styles = useStyles();
    return (
        <View style={styles.container}>
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

    useEffect(() => {
        navigation.setOptions({headerShown: false})
    }, [])

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
    const {width, height} = Dimensions.get("screen")
    const tabBarHeight = useBottomTabBarHeight();

    const renderRecipe = ({item}) => {
        
        return (
            <View>
                <Image
                source={{uri: item.image_uri}}
                style={{width: width, height: height - tabBarHeight}}
                />
                <View style={{position: 'absolute', bottom: 140, right: 20}}>
                    <TouchableOpacity
                    onPress={() => {likeRecipe(item.id)}}
                    style={{marginVertical: 50}}
                    > 
                        <Image source={require('../../assets/dark/heart.png')} style={{width: 32, height: 32}} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => {likeRecipe(item.id)}}
                    style={{marginBottom: 10}}
                    > 
                        <Image source={require('../../assets/dark/dots.png')} style={{width: 32, height: 32}} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                style={{borderRadius: 20, position: 'absolute', padding: 20, bottom: 10, width: width, flexDirection: 'row', justifyContent: 'space-between'}}
                onPress={() => {navigation.navigate("Recipe", {prevScreen: "Explore", recipe: item})}}
                >
                    <View>
                        <Recipe
                        recipe={item}
                        />
                        <Text style={styles.text}>by {item.display_name}</Text>
                        <Text style={styles.lowImpactText}>{item.description}</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <Image source={require('../../assets/dark/chevron_right.png')} style={{width: 32, height: 32}} />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {loading ? (
                    <View style={{height: height, justifyContent: 'center'}}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <FlatList
                    data={recipes}
                    renderItem={renderRecipe}
                    keyExtractor={item => item.recipe_id}
                    extraData={loading}
                    pagingEnabled={true}
                    snapToAlignment={'end'}
                    decelerationRate='fast'
                    style={styles.recipeList}
                    showsVerticalScrollIndicator={false}
                    onRefresh={() => onRefresh()}
                    refreshing={refreshing}
                    ListFooterComponent={<ExploreFooter />}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

export default Explore;