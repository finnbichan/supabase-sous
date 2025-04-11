import { Text, SafeAreaView, View, TouchableOpacity, TextInput, ActivityIndicator, Switch, ScrollView, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { styles } from '../styles/Common';
import Dropdown from '../components/Dropdown';
import Steps from '../components/Steps';
import { supabase } from '../../supabase';
import { useHeaderHeight } from '@react-navigation/elements'
import DoneButton from '../components/DoneButton';
import FLTextInput from '../components/FloatingLabelInput';
import Checkbox from '../components/Checkbox';

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
    const [validationFailed, setValidationFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const height = useHeaderHeight();

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
        const data = await supabase
        .from('recipes')
        .insert({
            name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON
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
        const data = await supabase
        .from('recipes')
        .update({
            name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON
            })
        .eq('id', recipe.recipe_id)
        setSubmitting(false)
        navigation.navigate('Recipe', {action: "update", recipe: recipe})
        }
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.recipeTitleBox, {left: 10}]}>
                <Text style={styles.title}>{newRecipe ? "New Recipe" : recipe.name}</Text>
            </View>
            <KeyboardAvoidingView
            keyboardVerticalOffset={height}
            behavior='padding'
            style={{flexGrow: 1}}
            >
            <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            >
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
                <View style={AddOrEditStyles.checkboxContainer}>
                    <Text style={styles.text}>Steps</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={styles.text}>Add steps now?</Text>
                        <Checkbox 
                        isChecked={addSteps}
                        onPress={() => setAddSteps(!addSteps)}/>
                    </View>
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