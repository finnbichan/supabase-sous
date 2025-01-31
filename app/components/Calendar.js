import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import Recipe from './RecipeOverview';
import { supabase } from '../../supabase';
import NoPlan from './NoPlan';
import CollapsibleSection from './CollapsibleSection';
import CalendarHeader from './CalendarHeader';
import { AuthContext } from '../../Contexts';
import MealPlan from './MealPlan';


const calendarStyles = StyleSheet.create({
    calendarList: {
        flexGrow: 1
    },
    parentDateContainer: {
        borderRadius: 4,
        padding: 4,
        margin: 4,
        width: '95%'
    },
    titleBox: {
        margin: '-4',
        borderRadius: 2,
        flexDirection: 'row',
        maxWidth: '100%',
        padding: 4
    },
    largeText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'heavy',
        fontFamily: ''
    },
    largerText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'heavy',
        fontFamily: ''
    },
    flashIcon: {   
        marginLeft: 'auto'
    }
})


const Calendar = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [plannedRecipes, setPlannedRecipes] = useState([]);
    const todaysDate = new Date();

    const createDateArray = () => {
        let dateArray = [];
        for(let i = 0; i < 14; i++){
            let date = new Date()
            date.setDate(todaysDate.getDate() + i)
            dateArray.push(date.toISOString().slice(0,10))
        }
        return dateArray
    }

    const addPlannedRecipe = (newRecipe) => {
        console.log(newRecipe)
        setPlannedRecipes([...plannedRecipes, newRecipe]);
        console.log(plannedRecipes)
    }

    const deletePlannedRecipe = (id) => {
        const copy = plannedRecipes.filter(item => !(item.plannedrecipe_id === id));
        console.log("wah", copy);
        setPlannedRecipes([...copy]);
        console.log("deleting", plannedRecipes)
    }

    const createDateArrayForDropdown = (array) => {
        let i = 0;
        let dropdownDateArray = array.map((item) => {
            i++;
            return {
                "label": item,
                "id": i
            }
        })
        return dropdownDateArray;
    }


    const dateArray = createDateArray();

    

    useEffect(() => {
        setLoading(true);
        const getPlannedRecipes = async () => {
            const userData = await supabase.auth.getUser()
            const plannedRecipesData = await supabase
            .from('plannedrecipes')
            .select()
            .eq('user_id', userData.data.user.id)
            .eq('active', 1)
            .gte('date', dateArray[0])
            .lte('date', dateArray[dateArray.length - 1])
            .order('date')
            const recipesArray = plannedRecipesData.data.map((item) => item.recipe_id)
            const plannedRecipeIds = plannedRecipesData.data.map((item) => {
                return {
                    plannedrecipe_id: item.id,
                    date: item.date,
                    recipe: item.recipe_id,
                    meal_type: item.meal_type
                }}
            )
            const recipeFullData = await supabase
            .from('recipes')
            .select()
            .in('id', recipesArray)
            const plannedRecipesFull = recipeFullData.data.map((item) => {
                return {
                  recipe_id: item.id,
                  name: item.recipe_name,
                  ease: item.ease,
                  cuisine: item.cuisine,
                  diet: item.diet 
                }})
            const plannedRecipesComplete = plannedRecipeIds.map((item) => {
                return {
                    plannedrecipe_id: item.plannedrecipe_id,
                    date: item.date,
                    meal_type: item.meal_type,
                    recipe: plannedRecipesFull.find((recipe) => recipe.recipe_id === item.recipe)
                }
            })
            setPlannedRecipes(plannedRecipesComplete)
            console.log(plannedRecipes)
            setLoading(false)
        }
        getPlannedRecipes()
    }, [])

    const renderDate = (mealdate) => {
        const dateString = new Date(mealdate).toDateString().slice(0,10);

        const breakfast = plannedRecipes.find(({date, meal_type}) => date === mealdate && meal_type === 1)
        const lunch = plannedRecipes.find(({date, meal_type}) => date === mealdate & meal_type === 2)
        const dinner = plannedRecipes.find(({date, meal_type}) => date === mealdate && meal_type === 3)
        return (
            <View style={calendarStyles.parentDateContainer}>
                <View style={calendarStyles.titleBox}>
                    {mealdate === todaysDate.toISOString().slice(0,10) ? (
                        <Text style={calendarStyles.largerText}>Today's menu</Text>
                    ) : (
                        <Text style={calendarStyles.largeText}>{dateString}</Text>
                    )}
                </View>
                <View style={calendarStyles.mealsContainer}>
                <MealPlan
                navigation={navigation}
                meal_type={1}
                date={mealdate}
                recipe={breakfast?.recipe || null}
                plannedrecipe_id={breakfast?.plannedrecipe_id}
                addPlannedRecipe={addPlannedRecipe}
                deletePlannedRecipe={deletePlannedRecipe}
                />
                <MealPlan
                navigation={navigation}
                meal_type={2}
                date={mealdate}
                recipe={lunch?.recipe || null}
                plannedrecipe_id={lunch?.plannedrecipe_id}
                addPlannedRecipe={addPlannedRecipe}
                deletePlannedRecipe={deletePlannedRecipe}
                />
                <MealPlan
                navigation={navigation}
                meal_type={3}
                date={mealdate}
                recipe={dinner?.recipe || null}
                plannedrecipe_id={dinner?.plannedrecipe_id}
                addPlannedRecipe={addPlannedRecipe}
                deletePlannedRecipe={deletePlannedRecipe}
                />
                </View>
            </View>
        )
    }
    
    return (
        <View style={styles.calendarParent}>
            {loading ? <ActivityIndicator/> : (
           <FlatList
                data={dateArray}
                renderItem={({item}) => renderDate(item)}
                style={styles.calendarList}
                ListHeaderComponent={
                <CalendarHeader 
                dateArray={createDateArrayForDropdown(dateArray)}
                />
                }
            /> 
            )}
        </View>
    );
}

export default Calendar;    