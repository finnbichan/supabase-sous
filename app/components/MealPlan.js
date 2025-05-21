import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Modal, Pressable } from 'react-native';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';
import { AuthContext } from '../../Contexts';
import RecipeBase from './RecipeBase';
import SearchModal from './SearchModal';
import { useTheme } from '@react-navigation/native';

const MealPlanStyles = (props) => StyleSheet.create({
    container: {
        backgroundColor: props.colours.card,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 4
    },
    header: {
        backgroundColor: props.colours.card,
        padding: 10,
    },
    title: {
        fontSize: 16,
        color: props.colours.text,
    },
    content: {
        padding: 10,
    },
    image: {
        height: 36,
        width: 36,
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
        color: props.colours.text,
        fontSize: 18,
        paddingLeft: 4,
        paddingBottom: 4
    },
    lowImpactText: {
        color: props.colours.secondaryText
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

function useMealPlanStyles() {
    const { colours } = useTheme();
    const mealPlanstyles = React.useMemo(() => MealPlanStyles({ colours }), [colours]);
    return mealPlanstyles;
  }

const NoPlan = ({ meal_name, date, meal_type, user_id, addPlannedRecipe }) => {
    const { assets } = useTheme(); 
    const mealPlanStyles = useMealPlanStyles();

    
    const [newMealLoading, setNewMealLoading] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    const session = useContext(AuthContext);

    

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
                        "name": item.name || "",
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

    const addRecipeBySearch = async (recipe, meal_type, date) => {
        setNewMealLoading(true);
        console.log("recipe", recipe)
        const {data, error} = await supabase
        .from('plannedrecipes')
        .insert([
            {
                user_id: session.user.id,
                recipe_id: recipe.recipe_id,
                date: date,
                meal_type: meal_type,
                active: true
            }
        ])
        .select()
        if (error) {
            console.log(error);
            setNewMealLoading(false);
        } else {
            console.log(data.id, "data", data)
            const createNewPlannedRecipe = (item) => {
                return {
                    "plannedrecipe_id": item.id || null,
                    "date": item.date || null,
                    "meal_type": item.meal_type || null,
                    "recipe": {
                        "recipe_id": item.recipe_id || "",
                        "name": recipe.name || "",
                        "ease": recipe.ease || 0,
                        "cuisine": recipe.cuisine || 0,
                        "diet": recipe.diet || 0
                    }
                } 
            }
            const newPlannedRecipe = createNewPlannedRecipe(data[0])
            console.log("new planned recipe", newPlannedRecipe)
            addPlannedRecipe(newPlannedRecipe);
            setNewMealLoading(false);
        }
    }

    return (
        <View>
            <SearchModal
            searchModalOpen={searchModalOpen}
            setSearchModalOpen={setSearchModalOpen}
            onSelectRecipe={addRecipeBySearch}
            meal_type={meal_type}
            date={date}
            />
            {newMealLoading ? (
                <>
                    <Text style={mealPlanStyles.lowImpactText}>{meal_name}</Text>
                    <ActivityIndicator style={{paddingBottom: 10}}/>
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
                        source={assets.search}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => suggestRecipe(meal_type, date, user_id)}
                    >
                        <Image
                        style={mealPlanStyles.image}
                        source={assets.bolt}
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
    const { assets } = useTheme();
    const mealPlanStyles = useMealPlanStyles();
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
                            "name": item.name || "",
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
                    <ActivityIndicator style={{paddingBottom: 10}}/>
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
                    onPress={deactivatePlannedRecipe}
                    
                    >
                        <Image
                        style={mealPlanStyles.image}
                        source={assets.cross}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => rerollRecipe(meal_type, date, user_id, plannedrecipe_id)}
                    >
                        <Image
                        style={mealPlanStyles.image}
                        source={assets.refresh}
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
    const mealPlanStyles = useMealPlanStyles();
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