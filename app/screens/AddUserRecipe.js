import { Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/Common';
import Dropdown from '../components/Dropdown';
import { supabase } from '../../supabase';

const AddUserRecipe = ( {navigation} ) => {
    const [name, setName] = useState(undefined);
    const [desc, setDesc] = useState(undefined);
    const [cuisine, setCuisine] = useState(undefined);
    const [diet, setDiet] = useState(undefined);
    const [ease, setEase] = useState(undefined);
    const [validationFailed, setValidationFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = () => {
        if (!(name && cuisine && diet && ease)) {
            setValidationFailed(true);
        } else {
            setValidationFailed(false);
            submit();
        }
    }

    const submit = async () => {
        setSubmitting(true);
        const data = await supabase
        .from('recipes')
        .insert([{
            recipe_name: name,
            ease: ease.id,
            cuisine: cuisine.id,
            diet: diet.id
            }])
        console.log(data)
        setSubmitting(false)
        navigation.navigate('Your recipes', {added: "true"})
        }
    

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
            style={styles.button}
            onPress={() => {
                navigation.navigate("Your recipes");
            }}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Add a new recipe</Text>
            <TextInput
            style={styles.input}
            onChangeText={setName}
            placeholder='Recipe name...'
            placeholderTextColor={'#fff'}
            />
            <Text style={styles.text}>Description (optional)</Text>
            <TextInput
            style={styles.input}
            onChangeText={setDesc}
            placeholder='Add a short description for this recipe'
            placeholderTextColor={'#fff'}
            />
            <Text style={styles.text}>Cuisine</Text>
            <Dropdown
            data={cuisineList}
            label="Select an option..."
            onSelect={setCuisine}
            />
            <Text style={styles.text}>Veggie or vegan?</Text>
            <Dropdown
            data={dietList}
            label="Select an option..."
            onSelect={setDiet}
            />
            <Text style={styles.text}>How long does it take?</Text>
            <Dropdown
            data={easeList}
            label="Select an option..."
            onSelect={setEase}
            />
            {submitting ? (
                <ActivityIndicator size="small"/>
            ) : (
            <TouchableOpacity
            style={styles.button}
            onPress={onSubmit}
            >
                <Text style={styles.buttonText}>Add recipe</Text>
            </TouchableOpacity>
            )}
            {validationFailed ? (<Text style={styles.text}>Please make sure you have filled in all the fields above</Text>) : (<></>)}
        </SafeAreaView>
    )
}

export default AddUserRecipe;