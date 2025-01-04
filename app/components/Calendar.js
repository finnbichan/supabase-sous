import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import Recipe from './RecipeOverview';
import { supabase } from '../../supabase';
import NoPlan from './NoPlan';


const Calendar = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [plannedRecipes, setPlannedRecipes] = useState(undefined);
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

    const dateArray = createDateArray();
    

    useEffect(() => {
        setLoading(true);
        const getPlannedRecipes = async () => {
            console.log("fetchingabc")
            const userData = await supabase.auth.getUser()
            const plannedRecipesData = await supabase
            .from('plannedrecipes')
            .select()
            .eq('user_id', userData.data.user.id)
            .gte('date', dateArray[0])
            .lte('date', dateArray[dateArray.length - 1])
            .order('date')
            const recipesArray = plannedRecipesData.data.map((item) => item.recipe_id)
            const plannedRecipeIds = plannedRecipesData.data.map((item) => {
                return {
                    date: item.date,
                    recipe: item.recipe_id
                }}
            )
            const recipeFullData = await supabase
            .from('recipes')
            .select()
            .in('id', recipesArray)
            const plannedRecipesFull = recipeFullData.data.map((item) => {
                return {
                  id: item.id,
                  name: item.recipe_name,
                  ease: item.ease,
                  cuisine: item.cuisine,
                  diet: item.diet 
                }})
            const plannedRecipesComplete = plannedRecipeIds.map((item) => {
                return {
                    [item.date] : plannedRecipesFull.find((recipe) => recipe.id === item.recipe)
                }
            })
            setPlannedRecipes(plannedRecipesComplete)
            setLoading(false)
        }
        getPlannedRecipes()
    }, [])

    const renderDate = (date) => {
        return (
            <View>
                {date === todaysDate.toISOString().slice(0,10) ? (
                    <Text style={styles.text}>Tonight's meal</Text>
                ) : (
                    <Text style={styles.text}>{date}</Text>
                )}
                {plannedRecipes[0][date] === undefined ? (
                    <NoPlan />
                ) : (
                <>
                    <Recipe
                    recipe={plannedRecipes[0][date]}
                    navigation={navigation}
                    />
                </>
                )}
            </View>
        )
    }
    
    return (
        <View style={styles.calendarParent}>
            {loading ? <ActivityIndicator/> : (
           <FlatList
            data={dateArray}
            renderItem={({item}) => renderDate(item)}
            /> 
            )}
        </View>
    );
}

export default Calendar;    