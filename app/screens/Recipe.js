import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styles } from '../styles/Common';
import { supabase } from '../../supabase';
import Steps from '../components/Steps';
import BackButton from '../components/BackButton';

const EditButton = ({nav, recipe}) => {
    return (
        <TouchableOpacity
        onPress={() => {
            nav.navigate("Add a recipe", {recipe: recipe});
        }}>
            <Image 
            style={styles.editButton}
            source={require('../../assets/edit.png')}
            />
        </TouchableOpacity>
    )
}

const Recipe = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(route.params.recipe);
    const [updated, setUpdated] = useState(route.params?.updated);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    console.log(typeof(recipe))
    
    useEffect(() => {
        getRecipeDetails = async () => {
        console.log("fetching additional info")
        const recipeAdditionalData = await supabase
        .from('recipes')
        .select('description, steps')
        .eq('id', recipe.id)
        const recipeExtra = {
            desc: recipeAdditionalData.data[0].description, 
            steps: JSON.parse(recipeAdditionalData.data[0].steps)
        }
        console.log(recipeExtra)
        setRecipe({...recipe, ...recipeExtra})
        console.log(recipe)
        setLoading(false)
        }
        getRecipeDetails()
    }, [updated])

    const DeleteModal = () => {
        if (deleteModalOpen) {
            console.log("open")
            return (
                <Modal visible={deleteModalOpen} transparent animationType='none'>
                    <Pressable
                    style={styles.overlay}
                    onPress={() => setDeleteModalOpen(false)}
                    >
                    <View style={styles.modal}>
                        <Text style={styles.text}>Are you sure you want to delete this recipe?</Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                            style={styles.button}
                            onPress={deleteRecipe}
                            >
                                <Text style={styles.buttonText}>Yes</Text>
                            </Pressable>
                            <Pressable
                            style={styles.button}
                            onPress={() => {setDeleteModalOpen(false)}}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                    </Pressable>
                </Modal>
            )
        }
    }

    const deleteRecipe = async () => {
        console.log("deleting")
    }

    return (
        <SafeAreaView style={styles.container}>
            {DeleteModal()}
            <View style={styles.recipeTitleBox}>
                <BackButton nav={navigation} />
                <Text style={styles.title}>{recipe.name}</Text>
                {loading ? <ActivityIndicator /> : <EditButton nav={navigation} recipe={recipe}/>}
            </View>
            
            <View style={styles.descriptorsParent}>
                    <View style={styles.descriptors}>
                        <Text style={styles.descriptorText}>{easeList[recipe.ease].label}</Text>
                    </View>
                    <View style={styles.descriptors}>
                        <Text style={styles.descriptorText}>{cuisineList[recipe.cuisine].label}</Text>
                    </View>
                    {recipe.diet == 0 ? (<></>):(
                    <View style={styles.descriptors}>
                        <Text style={styles.descriptorText}>{dietList[recipe.diet].label}</Text>
                    </View>
                )}
            </View>
            {loading ? (<ActivityIndicator size="large" />) : (
                <>
                    <View>
                        {recipe.desc ? 
                        (<Text style={styles.text}>{recipe.desc}</Text>) : 
                        (<Text style={styles.text}>No description added</Text>)}
                    </View>
                    <View>
                        {recipe.steps ? (
                        <Steps
                        editable={false}
                        steps={recipe.steps}
                        />
                        ) : (
                            <Text style={styles.text}>No steps added</Text>
                        )}
                    </View>
                    
                </>
            )}
            <TouchableOpacity
            style={styles.button}
            onPress={() => setDeleteModalOpen(true)}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        </SafeAreaView>
        
    )
}

export default Recipe;