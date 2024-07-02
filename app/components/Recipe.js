import React from 'react';
import { View, Text,StyleSheet } from 'react-native';

recipeStyles = StyleSheet.create({
    recipe: {
        backgroundColor: "#fff"
    },
    descriptorsParent: {
        flexDirection: "row",
    },
    descriptors: {
        backgroundColor: "#000",
        borderRadius: "4",
        margin: "10",
        padding: "10",
        marginEnd: "10"
    },
    descriptorText : {
        color: "#fff"
    }
})

const Recipe = ({name, cuisine, ease, diet}) => {
    return (
        <View style={recipeStyles.recipe}>
            <Text>{name}</Text>
            <View style={recipeStyles.descriptorsParent}>
            <View style={recipeStyles.descriptors}>
                <Text style={recipeStyles.descriptorText}>{easeList[ease].label}</Text>
                </View>
                <View style={recipeStyles.descriptors}>
                    <Text style={recipeStyles.descriptorText}>{cuisineList[cuisine].label}</Text>
                </View> 
                {diet == 0 ? (<></>):(
                <View style={recipeStyles.descriptors}>
                <Text style={recipeStyles.descriptorText}>{dietList[diet].label}</Text>
                </View> ) 
                }
            </View>
        </View>
    )
}

export default Recipe;