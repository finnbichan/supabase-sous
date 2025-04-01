import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Modal, Pressable } from 'react-native';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';
import RecipeBase from './RecipeBase';
import SearchModal from './SearchModal';

const mealPlanStyles = StyleSheet.create({
    container: {
        backgroundColor: '#222222',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 4
    },
    header: {
        backgroundColor: '#222222',
        padding: 10,
    },
    title: {
        fontSize: 16,
        color: '#fff',
    },
    content: {
        padding: 10,
    },
    image: {
        height: 32,
        width: 32,
        marginHorizontal: 8
    },
    noPlanContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '99%'
    },
    noPlanButtons: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    noPlanText: {
        color: '#FFF',
        fontSize: 18,
        paddingLeft: 4,
        paddingBottom: 4
    },
    lowImpactText: {
        color: '#b3b3b3'
    },
    yesPlanTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '99%',
        marginTop: 4,
        marginBottom: 4
    },
    yesPlanLeftSection: {
        maxWidth: '73%'
    }
});

const NoPlan = ({ meal_name, date, meal_type, user_id, addPlannedRecipe }) => {
    const [newMealLoading, setNewMealLoading] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    const suggestRecipe = async (meal_type, date, user_id) => {
        setNewMealLoading(true);
        const {data, error} = await supabase.rpc('suggest_recipe', {mealtype_input: meal_type, date_input:date, userid_input: user_id})
        if (error) {
            console.log(error);
            setNewMealLoading(false);
        } else {
            console.log("data", data)
            const createNewPlannedRecipe = (item) => {
                return {
                    "plannedrecipe_id": item.id || null,
                    "date": item.date || null,
                    "meal_type": item.meal_type || null,
                    "recipe": {
                        "recipe_id": item.recipe_id || "",
                        "name": item.recipe_name || "",
                        "ease": item.ease || 0,
                        "cuisine": item.cuisine || 0,
                        "diet": item.diet || 0,
                        "user_id": item.user_id || null
                    }
                } 
            }
            const newPlannedRecipe = createNewPlannedRecipe(data)
            addPlannedRecipe(newPlannedRecipe);
            setNewMealLoading(false);
        }
    }

    return (
        <View>
            <SearchModal
            searchModalOpen={searchModalOpen}
            setSearchModalOpen={setSearchModalOpen}
            />
            {newMealLoading ? (
                <>
                    <Text style={mealPlanStyles.lowImpactText}>{meal_name}</Text>
                    <ActivityIndicator />
                </>
            ) : (
            <View style={mealPlanStyles.noPlanContainer}>
                <View>
                    <Text style={mealPlanStyles.lowImpactText}>{meal_name}</Text>
                    <Text style={mealPlanStyles.noPlanText}>Nothing planned</Text>
                </View>
                <View style={mealPlanStyles.noPlanButtons}>
                    <TouchableOpacity
                    onPress={() => setSearchModalOpen(true)}>
                        <Image
                        style={mealPlanStyles.image}
                        source={require('../../assets/search.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => suggestRecipe(meal_type, date, user_id)}
                    >
                        <Image
                        style={mealPlanStyles.image}
                        source={require('../../assets/bolt.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    )
}

const YesPlan = ({navigation, user_id, meal_name, meal_type, recipe, date, plannedrecipe_id, addPlannedRecipe, deletePlannedRecipe, rerollPlannedRecipe}) => {
    const [loading, setLoading] = useState(false)
    const deactivatePlannedRecipe = async () => {
        console.log(plannedrecipe_id)
        setLoading(true)
        const {data, error} = await supabase
        .from('plannedrecipes')
        .update({active: false})
        .eq('id', plannedrecipe_id)
        if (error) {
            console.log("error", error);
        } else {
            console.log("data", data, plannedrecipe_id)
            deletePlannedRecipe(plannedrecipe_id);
        }
        setLoading(false);
    }
    //TODO reduce repetition in functions
    const rerollRecipe = async (meal_type, date, user_id, plannedrecipe_id) => {
        setLoading(true)
        //deactivate existing recipe
        const {data: delete_data, error: delete_error} = await supabase
        .from('plannedrecipes')
        .update({active: false})
        .eq('id', plannedrecipe_id)
        if (delete_error) {
            console.log("error", delete_error);
        } else {
            //generate new recipe
            const { data: suggest_data, error: suggest_error } = await supabase.rpc('suggest_recipe', {mealtype_input: meal_type, date_input:date, userid_input: user_id})
            if (suggest_error) {
                console.log(suggest_error);
            } else {
                const createNewPlannedRecipe = (item) => {
                    return {
                        "plannedrecipe_id": item.id || null,
                        "date": item.date || null,
                        "meal_type": item.meal_type || null,
                        "recipe": {
                            "recipe_id": item.recipe_id || "",
                            "name": item.recipe_name || "",
                            "ease": item.ease || 0,
                            "cuisine": item.cuisine || 0,
                            "diet": item.diet || 0
                        }
                    } 
                }
                const newPlannedRecipe = createNewPlannedRecipe(suggest_data)
                rerollPlannedRecipe(newPlannedRecipe, plannedrecipe_id);
            }
        }       
        setLoading(false)
    }
    return (
        <View>
            {loading ? (
                <>
                    <Text style={mealPlanStyles.lowImpactText}>{meal_name}</Text>
                    <ActivityIndicator />
                </>
            ) : (
            <View style={mealPlanStyles.yesPlanTopRow}>
                <TouchableOpacity
                onPress={()=>{
                    navigation.navigate("Recipe", {prevScreen: 'Home', recipe: recipe});
                }}
                style={mealPlanStyles.yesPlanLeftSection}
                >
                    <Text style={mealPlanStyles.lowImpactText}>{meal_name}</Text>
                    <RecipeBase
                    recipe={recipe}
                    />
                </TouchableOpacity>
                <View style={mealPlanStyles.noPlanButtons}>
                    <TouchableOpacity
                    onPress={() => rerollRecipe(meal_type, date, user_id, plannedrecipe_id)}
                    >
                        <Image
                        style={mealPlanStyles.image}
                        source={require('../../assets/refresh.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={deactivatePlannedRecipe}
                    >
                        <Image
                        style={mealPlanStyles.image}
                        source={require('../../assets/cross.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </View>
    )
}

const MealPlan = ({ navigation, meal_type, date, recipe, plannedrecipe_id, addPlannedRecipe, deletePlannedRecipe, rerollPlannedRecipe }) => {
    const session = useContext(AuthContext)
    var meal_name = null;
    switch(meal_type) {
        case(1) : {meal_name="Breakfast"; break;}
        case(2) : {meal_name="Lunch"; break;}
        case(3) : {meal_name="Dinner"; break;}
        default : {meal_name="Unknown Meal"}
    }
    return (
        <View style={mealPlanStyles.container}>
            {recipe === null ? (
                <NoPlan
                user_id={session.user.id}
                meal_name={meal_name}
                meal_type={meal_type}
                date={date}
                addPlannedRecipe={addPlannedRecipe}
                />
            ) : (
                <YesPlan
                navigation={navigation}
                user_id={session.user.id}
                meal_name={meal_name}
                meal_type={meal_type}
                recipe={recipe}
                date={date}
                plannedrecipe_id={plannedrecipe_id}
                addPlannedRecipe={addPlannedRecipe}
                deletePlannedRecipe={deletePlannedRecipe}
                rerollPlannedRecipe={rerollPlannedRecipe}
                />
            )}
        </View>
    );
};


export default MealPlan;