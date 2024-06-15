import { Text, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { styles } from '../styles/Common';
import Dropdown from '../components/Dropdown';

const AddUserRecipe = ( {navigation} ) => {
    const [name, setName] = useState(undefined);
    const [cuisine, setCuisine] = useState(undefined);
    const [diet, setDiet] = useState(undefined);
    const [ease, setEase] = useState(undefined);
    const [validationFailed, setValidationFailed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

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
        addDoc(collection(firebase_db, "recipes"), {
            name: name,
            cuisine: cuisine.id,
            diet: diet.id,
            ease: ease.id,
            user: user.uid
        })
        .then(doc => {
            console.log(doc);
        })
        .catch(err => {
            console.log(err);  
        })
        .finally(() => {
            setSubmitting(false);
            navigation.navigate("Your recipes", {added: "true"})
        })
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
            <Text>Add a new recipe</Text>
            <TextInput
            style={styles.input}
            onChangeText={setName}
            placeholder='Recipe name...'
            />
            <Text>Cuisine</Text>
            <Dropdown
            data={cuisineList}
            label="Select an option..."
            onSelect={setCuisine}
            />
            <Text>Veggie or vegan?</Text>
            <Dropdown
            data={dietList}
            label="Select an option..."
            onSelect={setDiet}
            />
            <Text>How long does it take?</Text>
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
            {validationFailed ? (<Text>Please make sure you have filled in all the fields above</Text>) : (<></>)}
        </SafeAreaView>
    )
}

export default AddUserRecipe;