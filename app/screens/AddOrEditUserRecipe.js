import { Text, SafeAreaView, View, TouchableOpacity, TextInput, ActivityIndicator, Switch, ScrollView, KeyboardAvoidingView, Image } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/Common';
import Dropdown from '../components/Dropdown';
import Steps from '../components/Steps';
import { supabase } from '../../supabase';
import { useHeaderHeight } from '@react-navigation/elements'
import BackButton from '../components/BackButton';

const SubmitButton = ( {onPress} ) => {
    return (
        <TouchableOpacity
        onPress={onPress}
        >
            <Image 
            style={styles.editButton}
            source={require('../../assets/tick.png')}
            />
        </TouchableOpacity>
    )
}

const AddOrEditUserRecipe = ( {route, navigation} ) => {
    const [recipe, setRecipe] = useState(route.params?.recipe ? route.params?.recipe : {});
    const [addSteps, setAddSteps] = useState(!route.params?.recipe || route.params?.recipe.steps ? true : false);
    const [steps, setSteps] = useState(route.params?.recipe.steps ? route.params?.recipe.steps : Array(1).fill(null));
    const [validationFailed, setValidationFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const height = useHeaderHeight();

    const newRecipe = route.params?.recipe ? false : true;

    const changeRecipeProperty = (prop, newValue) => {
        const recipeCopy = recipe;
        recipeCopy[prop] = newValue;
        console.log(prop, newValue)
        setRecipe(recipeCopy);
        console.log(recipe);
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
            recipe.id ? update() : insert();
        }
    }

    const insert = async () => {
        setSubmitting(true);
        const stepsJSON = addSteps ? JSON.stringify(steps) : null
        const data = await supabase
        .from('recipes')
        .insert({
            recipe_name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON
            })
        setSubmitting(false)
        navigation.navigate('Recipe', {action: "add", recipe: recipe})
        }

    const update = async () => {
        setSubmitting(true);
        const stepsJSON = addSteps ? JSON.stringify(steps) : null
        console.log("updating", recipe.id)
        const data = await supabase
        .from('recipes')
        .update({
            recipe_name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON
            })
        .eq('id', recipe.id)
        console.log(data)
        setSubmitting(false)
        navigation.navigate('Recipe', {action: "update", recipe: recipe})
        }
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.recipeTitleBox}>
                <BackButton nav={navigation} />
                <Text style={styles.title}>{newRecipe ? "New Recipe" : recipe.name}</Text>
                {submitting ? (
                    <ActivityIndicator size="small"/>
                ) : (
                <SubmitButton onPress={onSubmit}/>
                )}
            </View>
            <KeyboardAvoidingView
            keyboardVerticalOffset={height}
            behavior='padding'
            style={{flexGrow: 1}}
            >
            <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            >
                <TextInput
                id="name"
                style={styles.input}
                defaultValue={recipe.name}
                onChangeText={(text) => {changeRecipeProperty("name", text)}}
                placeholder='Recipe name...'
                placeholderTextColor={'#fff'}
                />
                <Text style={styles.text}>Description (optional)</Text>
                <TextInput
                id="description"
                style={styles.input}
                defaultValue={recipe.desc}
                onChangeText={(text) => {changeRecipeProperty("desc", text)}}
                placeholder='Add a short description for this recipe'
                placeholderTextColor={'#fff'}
                />
                <Text style={styles.text}>Cuisine</Text>
                <Dropdown
                data={cuisineList}
                label="Select an option..."
                onSelect={(selected) => {changeRecipeProperty("cuisine", selected.id)}}
                value={recipe.cuisine}
                />
                <Text style={styles.text}>Veggie or vegan?</Text>
                <Dropdown
                data={dietList}
                label="Select an option..."
                onSelect={(selected) => {changeRecipeProperty("diet", selected.id)}}
                value={recipe.diet}
                />
                <Text style={styles.text}>How long does it take?</Text>
                <Dropdown
                data={easeList}
                label="Select an option..."
                onSelect={(selected) => {changeRecipeProperty("ease", selected.id)}}
                value={recipe.ease}
                />
                <Text style={styles.text}>Steps</Text>
                <Text style={styles.text}>Add steps now?</Text>
                <Switch
                onValueChange={() => setAddSteps(!addSteps)}
                value={addSteps}
                />
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