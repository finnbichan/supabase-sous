import { Image, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { styles } from '../styles/Common';
import { AuthContext } from '../../Contexts';
import { supabase } from '../../supabase';

const noPlanStyles = StyleSheet.create({
    box: {
        backgroundColor: "#222222",
        borderRadius: 4,
        padding: 4,
        margin: 1,
        flexDirection: 'row',
        flexGrow: 1
    },
    image: {
        height: 50,
        width: 50
    }
})

const NoPlan = ({ date_prop, meal_type_prop, addPlannedRecipe }) => {
    const [newMealLoading, setNewMealLoading] = useState(false);
    const session = useContext(AuthContext)

    const suggestRecipe = async (meal_type, date) => {
        setNewMealLoading(true);
        const {data, error} = await supabase.rpc('suggest_recipe', {mealtype_input: meal_type, date_input:date, userid_input: session.user.id})
        if (error) {console.log(error);setNewMealLoading(false);} else {
            console.log("data", data)
            const createNewPlannedRecipe = (item) => {
                return {
                    "date": item.date || null,
                    "meal_type": item.meal_type || null,
                    "recipe": {
                        "id": item.recipe_id || "",
                        "name": item.recipe_name || "",
                        "ease": item.ease || 0,
                        "cuisine": item.cuisine || 0,
                        "diet": item.diet || 0
                    }
                } 
            }
            const newPlannedRecipe = createNewPlannedRecipe(data)
            addPlannedRecipe(newPlannedRecipe);
            setNewMealLoading(false);
        }
    }

    return (
        <View style={noPlanStyles.box}>
            {newMealLoading ? (<ActivityIndicator/>) : (
                <>
                    <TextInput
                    style={styles.input}
                    placeholder="Search"
                    placeholderTextColor={'#a9a9a9'}
                    />
                    <TouchableOpacity
                    onPress={() => suggestRecipe(meal_type_prop, date_prop)}
                    >
                        <Image
                        style={noPlanStyles.image}
                        source={require('../../assets/bolt.png')}
                        />
                    </TouchableOpacity>
                </>
            )}
        </View>
    )
}

export default NoPlan;