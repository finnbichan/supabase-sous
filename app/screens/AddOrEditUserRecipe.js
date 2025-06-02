import { Text, SafeAreaView, View, TouchableOpacity, TextInput, ActivityIndicator, Switch, ScrollView, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import useStyles from '../styles/Common';
import Dropdown from '../components/Dropdown';
import Steps from '../components/Steps';
import { supabase } from '../../supabase';
import { useHeaderHeight } from '@react-navigation/elements'
import DoneButton from '../components/DoneButton';
import FLTextInput from '../components/FloatingLabelInput';
import Checkbox from '../components/Checkbox';
import AppHeaderText from '../components/AppHeaderText';
import { useTheme } from '@react-navigation/native';
import Ingredients from '../components/Ingredients';
import Multiselect from '../components/Multiselect';

const AddOrEditStyles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 8,
        marginTop: 20,
    }
})

const AddOrEditUserRecipe = ( {route, navigation} ) => {
    const [recipe, setRecipe] = useState(route.params?.recipe ? route.params?.recipe : {});
    const [addSteps, setAddSteps] = useState(!route.params?.recipe || route.params?.recipe.steps ? true : false);
    const [steps, setSteps] = useState(route.params?.recipe?.steps ? route.params?.recipe.steps : Array(1).fill(null));
    const [addIngredients, setAddIngredients] = useState(true);
    const [ingredients, setIngredients] = useState(Array(1).fill(null));
    const [validationFailed, setValidationFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const height = useHeaderHeight();
    const styles = useStyles();
    const { colours } = useTheme();
    const mealTypesList = [
        {id: 1, name: "Breakfast", selected: false},
        {id: 2, name: "Lunch", selected: false},
        {id: 3, name: "Dinner", selected: false}
    ];
    const [mealTypes, setMealTypes] = useState(mealTypesList);


    const newRecipe = route.params?.recipe ? false : true;

    useEffect(() => {
            navigation.setOptions({
                headerRight: () => (
                    <DoneButton
                    onSubmit={onSubmit}
                    isSubmitting={submitting}
                    />
                )
                });
          }, [navigation, recipe, steps, submitting, addSteps]);

    const changeRecipeProperty = (prop, newValue) => {
        const recipeCopy = recipe;
        recipeCopy[prop] = newValue;
        setRecipe(recipeCopy);
    }

    const addStep = () => {
        let temp = [...steps];
        temp.push(null);
        setSteps(temp);
    }

    const updateStep = (num, text) => {
        let temp = [...steps];
        temp[num] = text;
        setSteps(temp);
    }

    const removeStep = (num) => {
        let temp = [...steps];
        temp.splice(num, 1);
        setSteps(temp);
    }
     const addIngredient = () => {
        let temp = [...ingredients];
        temp.push(null);
        setIngredients(temp);
    }

    const updateIngredient = (num, text) => {
        let temp = [...ingredients];
        temp[num] = text;
        setIngredients(temp);
    }

    const removeIngredient = (num) => {
        let temp = [...ingredients];
        temp.splice(num, 1);
        setIngredients(temp);
    }

    const onMultiselectChange = (id) => {
        const temp = [...mealTypes];
        const index = temp.findIndex((x) => x.id === id);
        temp[index].selected = !temp[index].selected;
        setMealTypes(temp);
    }
    console.log("outside", mealTypes)
    const validateDropdown = (value) => {
        if (value == null || value == undefined) {return false} else {return true}
    }

    const onSubmit = () => {
        if (!(recipe.name && validateDropdown(recipe.cuisine) && validateDropdown(recipe.diet) && validateDropdown(recipe.ease))) {
            setValidationFailed(true);
        } else {
            setValidationFailed(false);
            recipe.recipe_id ? update() : insert();
        }
    }

    const insert = async () => {
        setSubmitting(true);
        const stepsJSON = addSteps ? JSON.stringify(steps) : null
        const ingredientsJSON = addIngredients ? JSON.stringify(ingredients) : null;
        const meals = mealTypes.filter((x) => x.selected).map((x) => x.id);
        console.log(ingredientsJSON, stepsJSON, meals)
        const data = await supabase
        .from('recipes')
        .insert({
            name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON,
            ingredients: ingredientsJSON,
            meals: meals
            })
        .select()
        data.data[0].recipe_id = data.data[0].id
        delete data.data[0].id
        setSubmitting(false)
        navigation.navigate('Recipe', {action: "add", recipe: data.data[0]})
        }

    const update = async () => {
        setSubmitting(true);
        const stepsJSON = addSteps ? JSON.stringify(steps) : null
        const ingredientsJSON = addIngredients ? JSON.stringify(ingredients) : null;
        const data = await supabase
        .from('recipes')
        .update({
            name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON,
            ingredients: ingredientsJSON
            })
        .eq('id', recipe.recipe_id)
        setSubmitting(false)
        navigation.navigate('Recipe', {action: "update", recipe: recipe})
        }
    

    return (
        <SafeAreaView style={styles.container}>
            
            <KeyboardAvoidingView
            keyboardVerticalOffset={height}
            behavior='padding'
            style={{flexGrow: 1, marginTop: '-5'}}
            >
            <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            >
                <AppHeaderText>{newRecipe ? "New Recipe" : recipe.name}</AppHeaderText>
                <FLTextInput
                id="name"
                defaultValue={recipe.name}
                onChangeTextProp={(text) => {changeRecipeProperty("name", text)}}
                label='Name'
                />
                <FLTextInput
                id="description"
                defaultValue={recipe.desc}
                onChangeTextProp={(text) => {changeRecipeProperty("desc", text)}}
                label='Description (optional)'
                />               
                <Dropdown
                data={cuisineList}
                label="Cuisine"
                onSelect={(selected) => {changeRecipeProperty("cuisine", selected.id)}}
                value={recipe.cuisine}
                />
                <Dropdown
                data={dietList}
                label="Veggie or vegan?"
                onSelect={(selected) => {changeRecipeProperty("diet", selected.id)}}
                value={recipe.diet}
                />
                <Dropdown
                data={easeList}
                label="How long?"
                onSelect={(selected) => {changeRecipeProperty("ease", selected.id)}}
                value={recipe.ease}
                />
                <Text style={[styles.text, {margin: 8}]}>Which meals? (select all that apply)</Text>
                <Multiselect
                data={mealTypes}
                onPress={onMultiselectChange}
                />
                <View style={AddOrEditStyles.checkboxContainer}>
                    <Text style={styles.text}>Ingredients</Text>
                    <Switch
                    trackColor={{false: colours.card, true: '#00AEFF'}}
                    thumbColor={colours.layer}
                    value={addIngredients}
                    onValueChange={() => setAddIngredients(!addIngredients)}
                    />
                </View>
                {addIngredients ? (
                    <Ingredients
                    ingredients={ingredients}
                    onAddition={addIngredient}
                    onChangeText={updateIngredient}
                    onRemove={removeIngredient}
                    editable={true}
                    />
                ) : (<></>)}
                <View style={AddOrEditStyles.checkboxContainer}>
                    <Text style={styles.text}>Steps</Text>
                    <Switch
                    trackColor={{false: colours.card, true: '#00AEFF'}}
                    thumbColor={colours.layer}
                    value={addSteps}
                    onValueChange={() => setAddSteps(!addSteps)}
                    />
                </View>
                {addSteps ? (
                    <Steps
                    steps={steps}
                    onAddition={addStep}
                    onChangeText={updateStep}
                    onRemove={removeStep}
                    editable={true}
                    />
                ) : (<></>)
                }
                {validationFailed ? (<Text style={styles.text}>Please make sure you have filled in all the fields above</Text>) : (<></>)}
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddOrEditUserRecipe;