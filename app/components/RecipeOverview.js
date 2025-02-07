import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Image } from 'react-native';
import { styles } from '../styles/Common';
import RecipeBase from './RecipeBase';


const recipeStyles = StyleSheet.create({
    recipe: {
        backgroundColor: "#222222",
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

const Recipe = ({recipe, navigation}) => {
    return (
        <TouchableOpacity
        style={recipeStyles.recipe}
        onPress={()=>{
            navigation.navigate("Recipes", {screen: 'Recipe', params: {recipe: recipe}});
        }}
        >
            <RecipeBase
            recipe={recipe}
            />
            <View style={recipeStyles.buttonSection}> 
                <Image 
                style={recipeStyles.chevron}
                source={require('../../assets/chevron_right.png')}
                />
            </View>
        </TouchableOpacity>
    )
}

export default Recipe;