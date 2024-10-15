import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, FlatList, TouchableWithoutFeedback } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';


const Recipe = ({route, navigation}) => {
    recipe = route.params.recipe;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
            style={styles.button}
            onPress={() => {
                navigation.navigate("Your recipes");
            }}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{recipe.name}</Text>
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
                    </View>
                )}
            </View>
        </SafeAreaView>
        
    )
}

export default Recipe;