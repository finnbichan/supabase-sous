import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Image } from 'react-native';
import RecipeBase from './RecipeBase';
import { useTheme } from '@react-navigation/native';

const Recipe = ({recipe, navigation}) => {
    const { assets, colours } = useTheme(); 
    const recipeStyles = StyleSheet.create({
    recipe: {
        backgroundColor: colours.card,
        borderRadius: 4,
        padding: 4,
        margin: 1,
        flexDirection: 'row',
        flexGrow: 1,
        maxWidth: '99%',
        marginBottom: 2,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        color: "#fff",
        fontSize: 18
    },
    nameSection: {
        flexDirection: 'column',
        maxWidth: '90%'
    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    chevron: {
        maxHeight: 30,
        maxWidth: 30
    }
})
    return (
        <TouchableOpacity
        style={recipeStyles.recipe}
        onPress={()=>{
            navigation.navigate("Recipe", {prevScreen: 'Your recipes', recipe: recipe});
        }}
        >
            <RecipeBase
            recipe={recipe}
            />
            <View style={recipeStyles.buttonSection}> 
                <Image 
                style={recipeStyles.chevron}
                source={assets.chevron_right}
                />
            </View>
        </TouchableOpacity>
    )
}

export default Recipe;