import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../styles/Common';

const recipeStyles = StyleSheet.create({
    recipe: {
        backgroundColor: "#222222",
        borderRadius: 4,
        padding: 4,
        margin: 1,
        flexDirection: 'row',
        flexGrow: 1
    },
    name: {
        color: "#fff",
        fontSize: 18
    },
    nameSection: {
        flexDirection: 'column',
        maxWidth: '95%'
    },
    buttonSection: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    chevron: {
        maxHeight: 30,
        maxWidth: 30
    }
})

const RecipeBase = ({recipe}) => {
    return (
        <View style={recipeStyles.nameSection}>
                <Text style={recipeStyles.name}>{recipe.name}</Text>
                <View style={styles.descriptorsParent}>
                    <View style={styles.descriptors}>
                        <Text style={styles.descriptorText}>{easeList[recipe.ease].label}</Text>
                    </View>
                    <View style={styles.descriptors}>
                        <Text style={styles.descriptorText}>{cuisineList[recipe.cuisine].label}</Text>
                    </View>
                    {recipe.diet == 0 ? (<></>):(
                    <View style={styles.descriptors}>
                        <Text style={styles.descriptorText}>{dietList[recipe.diet].label}</Text>
                    </View> )
                    }
                </View>
            </View>
    );
}

export default RecipeBase;