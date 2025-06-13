import { Text, SafeAreaView, View, TouchableOpacity, TextInput, ActivityIndicator, Switch, ScrollView, KeyboardAvoidingView, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import useStyles from '../styles/Common';
import Dropdown from '../components/Dropdown';
import Steps from '../components/Steps';
import { supabase } from '../../supabase';
import { useHeaderHeight } from '@react-navigation/elements'
import DoneButton from '../components/DoneButton';
import FLTextInput from '../components/FloatingLabelInput';
import AppHeaderText from '../components/AppHeaderText';
import { useTheme } from '@react-navigation/native';
import Ingredients from '../components/Ingredients';
import Multiselect from '../components/Multiselect';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { AuthContext, CacheContext } from '../../Contexts';
import uuid from 'react-native-uuid';

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
    const {cache, setCache} = useContext(CacheContext);
    const [recipe, setRecipe] = useState(route.params?.recipe ? route.params?.recipe : {});
    const [addSteps, setAddSteps] = useState(!route.params?.recipe || route.params?.recipe.steps ? true : false);
    const [steps, setSteps] = useState(route.params?.recipe?.steps ? JSON.parse(route.params?.recipe.steps) : Array(1).fill(null));
    const [addIngredients, setAddIngredients] = useState(!route.params?.recipe || route.params?.recipe.ingredients ? true : false);
    const [ingredients, setIngredients] = useState(route.params?.recipe?.ingredients ? JSON.parse(route.params?.recipe.ingredients) : Array(1).fill(null));
    const [validationFailed, setValidationFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const height = useHeaderHeight();
    const styles = useStyles();
    const { assets, colours } = useTheme();
    const mealTypesList = [
        {id: 1, name: "Breakfast", selected: false},
        {id: 2, name: "Lunch", selected: false},
        {id: 3, name: "Dinner", selected: false}
    ];
    const convertMealTypes = (meals) => {
        const mealTypes = mealTypesList.map((x) => {
            return {
                ...x,
                selected: meals.includes(x.id)
            }})
            return mealTypes
    }
    const [mealTypes, setMealTypes] = useState(route.params?.recipe?.meals ? convertMealTypes(route.params?.recipe?.meals) : mealTypesList);
    const [image, setImage] = useState(route.params?.recipe?.image_uri ? route.params?.recipe?.image_uri : null);
    const [newImageUri, setNewImageUri] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [validationMessage, setValidationMessage] = useState('Something went wrong');
    const newRecipe = route.params?.recipe ? false : true;
    const session = useContext(AuthContext);

    useEffect(() => {
            navigation.setOptions({
                headerRight: () => (
                    <DoneButton
                    onSubmit={onSubmit}
                    isSubmitting={submitting}
                    />
                )
                });
          }, [navigation, recipe, steps, submitting, uploadingImage, addSteps, steps, addIngredients, ingredients, mealTypes, image, newImageUri]);

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
    const validateDropdown = (value) => {
        if (value == null || value == undefined) {return false} else {return true}
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
            base64: true
        })

        if(!result.canceled) {
            setImage(result.assets[0].uri)
            uploadImage(result.assets[0].base64)
        }
    }

    const getAndSetFullUri = async (file) => {
        const {data} = supabase.storage.from('recipe-images').getPublicUrl(file)
        setNewImageUri(data.publicUrl)
    }

    const uploadImage = async (pickedImageBase64) => {
        setUploadingImage(true)
        const recipe_file_path = uuid.v4() + '.png'
        console.log(recipe_file_path)
        const {data, error} = await supabase.storage.from('recipe-images').upload(recipe_file_path, decode(pickedImageBase64), {
            contentType: 'image/*',
            upsert: true
        }
        )
        if (error) {
            console.log("error with image upload", error)
        } else {
            console.log("wahoo", data);
            getAndSetFullUri(recipe_file_path);
        }
        setUploadingImage(false);
    }

    const validate = () => {
        if (uploadingImage) {
            setValidationMessage('Please wait for the image to finish uploading.')
            return false;
        } 
        else if (!(recipe.name && validateDropdown(recipe.cuisine) && validateDropdown(recipe.diet) && validateDropdown(recipe.ease))) {
            setValidationMessage('Please make sure all fields are filled in')
            return false
        }
        else if (!mealTypes.some((x) => x.selected === true)) {
            setValidationMessage('Please choose which meals this recipe is for')
            return false
        }
        else if (addIngredients && !ingredients[0]) {
            setValidationMessage('Please add some ingredients')
            return false
        } 
        else if (addSteps && !steps[0]) {
            setValidationMessage('Please add some steps')
            return false
        } else {
            return true
        }
    }

    const onSubmit = () => {
        if (!validate()) {
            setValidationFailed(true);
            setTimeout(() => setValidationFailed(false), 4000);
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
        const imageUri = newImageUri ? newImageUri : image;
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
            meals: meals,
            image_uri: imageUri
            })
        .select()
        data.data[0].recipe_id = data.data[0].id
        delete data.data[0].id
        setSubmitting(false)
        setCache(data.data[0])
        navigation.navigate('Recipe', {prevScreen: "Your recipes", recipe: data.data[0]})
        }

    const update = async () => {
        setSubmitting(true);
        const stepsJSON = addSteps ? JSON.stringify(steps) : null
        const ingredientsJSON = addIngredients ? JSON.stringify(ingredients) : null;
        const meals = mealTypes.filter((x) => x.selected).map((x) => x.id);
        const imageUri = newImageUri ? newImageUri : image;
        const data = await supabase
        .from('recipes')
        .update({
            name: recipe.name,
            description: recipe.desc,
            ease: recipe.ease,
            cuisine: recipe.cuisine,
            diet: recipe.diet,
            steps: stepsJSON,
            ingredients: ingredientsJSON,
            meals: meals,
            image_uri: imageUri
            })
        .eq('id', recipe.recipe_id)
        .select()
        data.data[0].recipe_id = data.data[0].id
        delete data.data[0].id
        setSubmitting(false)
        setCache(data.data[0])
        navigation.navigate('Recipe', {prevScreen: "Your recipes", recipe: data.data[0]})
        }

    return (
        <SafeAreaView style={styles.container}>
            {validationFailed ? (
            <View 
            style={{position: 'absolute', width: '98%', backgroundColor: 'red', zIndex: 1, margin: 4, borderRadius: 4}}
            >
                <Text style={[styles.text, {padding: 4}]}>{validationMessage}</Text>
            </View>
            ) : (<></>)}
            <KeyboardAvoidingView
            keyboardVerticalOffset={height}
            behavior='padding'
            style={{flexGrow: 1, marginTop: '-5'}}
            >
            <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            >
                {image ? (
                    <TouchableOpacity
                    onPress={pickImage}
                    >
                        <Image
                        source={{uri: image}}
                        style={{height: 300, width: '100%'}}
                        />
                        <Image
                        source={assets.camera}
                        style={[styles.icon, {position: 'absolute', alignSelf: 'center', top: 150}]}
                        />
                        {uploadingImage ? (
                        <>
                            <ActivityIndicator/> 
                            <Text style={styles.text}>Uploading...</Text>
                        </>
                        ): <></>}
                    </TouchableOpacity>
                ) : (
                    <View
                    style={{height: 100, width: '100%', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}
                    >
                        <TouchableOpacity
                        onPress={pickImage}
                        style={{backgroundColor: colours.card, borderRadius: 8, padding: 10}}
                        >
                            <Image
                            source={assets.camera}
                            style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    
                )}
                <AppHeaderText>{newRecipe ? "New Recipe" : recipe.name}</AppHeaderText>
                <FLTextInput
                id="name"
                defaultValue={recipe.name}
                onChangeTextProp={(text) => {changeRecipeProperty("name", text)}}
                label='Name'
                rerenderTrigger={uploadingImage}
                />
                <FLTextInput
                id="description"
                defaultValue={recipe.desc}
                onChangeTextProp={(text) => {changeRecipeProperty("desc", text)}}
                label='Description (optional)'
                rerenderTrigger={uploadingImage}
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
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AddOrEditUserRecipe;