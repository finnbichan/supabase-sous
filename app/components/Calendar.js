import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import CollapsibleSection from './CollapsibleSection';
import CalendarHeader from './CalendarHeader';
import MealPlan from './MealPlan';
import MealPlanSummary from './MealPlanSummary';


const calendarStyles = StyleSheet.create({
    parentDateContainer: {
        borderRadius: 4,
        padding: 4,
        marginBottom: 4
    },
    planContainer:{
        marginLeft: '-10'
    }
})


const Calendar = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [plannedRecipes, setPlannedRecipes] = useState([]);
    const [action, setAction] = useState();
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
        setPlannedRecipes(prevState => {
            const newState = [...prevState, newRecipe];
            return newState;
        });
    }

    const deletePlannedRecipe = (id) => {
        setPlannedRecipes(prevState => {
            const filteredCopy = prevState.filter(item => !(item.plannedrecipe_id === id));
            return filteredCopy;
        });
    }

    const removeAndAddPlannedRecipe = (newRecipe, idToRemove) => {
        deletePlannedRecipe(idToRemove);
        addPlannedRecipe(newRecipe);
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
                    name: item.name,
                    ease: item.ease,
                    cuisine: item.cuisine,
                    diet: item.diet,
                    user_id: item.user_id
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
    }, [action])

    const renderDate = (mealdate) => {
        const dateString = new Date(mealdate).toDateString().slice(0,10);
        const isTodaysMeal = mealdate === todaysDate.toISOString().slice(0,10)

        const breakfast = plannedRecipes.find(({date, meal_type}) => date === mealdate && meal_type === 1)
        const lunch = plannedRecipes.find(({date, meal_type}) => date === mealdate & meal_type === 2)
        const dinner = plannedRecipes.find(({date, meal_type}) => date === mealdate && meal_type === 3)
        return (
            <View style={calendarStyles.parentDateContainer}>
                <CollapsibleSection
                title={isTodaysMeal ? "Today's menu" : dateString}
                open={!isTodaysMeal}
                childrenIfOpen={
                    <View style={calendarStyles.planContainer}>
                        <MealPlan
                        navigation={navigation}
                        meal_type={1}
                        date={mealdate}
                        recipe={breakfast?.recipe || null}
                        plannedrecipe_id={breakfast?.plannedrecipe_id}
                        addPlannedRecipe={addPlannedRecipe}
                        deletePlannedRecipe={deletePlannedRecipe}
                        rerollPlannedRecipe={removeAndAddPlannedRecipe}
                        />
                        <MealPlan
                        navigation={navigation}
                        meal_type={2}
                        date={mealdate}
                        recipe={lunch?.recipe || null}
                        plannedrecipe_id={lunch?.plannedrecipe_id}
                        addPlannedRecipe={addPlannedRecipe}
                        deletePlannedRecipe={deletePlannedRecipe}
                        rerollPlannedRecipe={removeAndAddPlannedRecipe}
                        />
                        <MealPlan
                        navigation={navigation}
                        meal_type={3}
                        date={mealdate}
                        recipe={dinner?.recipe || null}
                        plannedrecipe_id={dinner?.plannedrecipe_id}
                        addPlannedRecipe={addPlannedRecipe}
                        deletePlannedRecipe={deletePlannedRecipe}
                        rerollPlannedRecipe={removeAndAddPlannedRecipe}
                        />
                    </View>
                }
                childrenIfClosed={
                    <MealPlanSummary
                    breakfast={breakfast?.recipe || null}
                    lunch={lunch?.recipe || null}
                    dinner={dinner?.recipe || null}
                    />
                }
                />
            </View>
        )
    }
    
    return (
        <View style={{width: '100%'}}>
            {loading ? (
            <View>
                <CalendarHeader />
                <ActivityIndicator/>  
            </View> 
        ) : (
           <FlatList
                data={dateArray}
                renderItem={({item}) => renderDate(item)}
                style={{marginBottom: '-5'}}
                ListHeaderComponent={
                <CalendarHeader />
                }
            /> 
            )}
        </View>
    );
}

export default Calendar;    