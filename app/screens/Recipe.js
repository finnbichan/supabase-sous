import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import useStyles from '../styles/Common';
import { supabase } from '../../supabase';
import Steps from '../components/Steps';
import { AuthContext } from '../../Contexts';
import FLTextInput from '../components/FloatingLabelInput';
import { useTheme } from '@react-navigation/native';
import AppHeaderText from '../components/AppHeaderText';
import Multiselect from '../components/Multiselect';
import EditButton from '../components/EditButton';

const Recipe = ({route, navigation}) => {
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(route.params.recipe);
    const [updated, setUpdated] = useState(route.params?.updated);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [creatorName, setCreatorName] = useState("");
    const [mealTypes, setMealTypes] = useState([]);
    const session = useContext(AuthContext);
    const isOwnRecipe = recipe.user_id == session.user.id;
    const { assets } = useTheme();
    const styles = useStyles();
    const mealTypeList = [
        {id: 1, name: "Breakfast"},
        {id: 2, name: "Lunch"},
        {id: 3, name: "Dinner"}
    ];

    console.log("yours", recipe)
    
    const getRecipeDetails = async () => {
        console.log("fetching additional info")
        const recipeAdditionalData = await supabase
        .from('recipes')
        .select('description, steps, ingredients, meals, has_image')
        .eq('id', recipe.recipe_id)
        const mealTypes = mealTypeList.map((x) => {
            return {
                ...x,
                selected: recipeAdditionalData.data[0].meals.includes(x.id)
            }
        })
        console.log(recipeAdditionalData.data[0])
        const recipeExtra = {
            desc: recipeAdditionalData.data[0].description, 
            steps: JSON.parse(recipeAdditionalData.data[0].steps),
            meals: mealTypes,
            hasImage: recipeAdditionalData.data[0].has_image
        }
        setRecipe({...recipe, ...recipeExtra})
        setMealTypes(mealTypes);
        setLoading(false)
        }
        //FIX for new recipes.
        const getCreatorName = async () => {
            console.log(recipe.user_id)
            const {data, error} = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', recipe.user_id)
            if (error) {
                console.log(error)
            } else {
                setCreatorName(data[0].display_name)
            }
        }

    useEffect(() => {
        getRecipeDetails()
    }, [updated])

     useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <EditButton nav={navigation} target={"Add a recipe"} params={{prevScreen: "Recipe", recipe: recipe}}/>
            )
            });
      }, [navigation, recipe]);

    useEffect(() => {
        if(!isOwnRecipe) {
            getCreatorName()
        }
    }, [])

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
                        <Text style={styles.text}>Are you sure you want to remove this recipe?</Text>
                        <View style={styles.modalButtons}>
                            {deleting ? <ActivityIndicator /> : (
                            <>
                                <Pressable
                                style={styles.button}
                                onPress={deleteRecipe}
                                >
                                    <Text style={styles.text}>Yes</Text>
                                </Pressable>
                                <Pressable
                                style={styles.button}
                                onPress={() => {setDeleteModalOpen(false)}}
                                >
                                    <Text style={styles.text}>Cancel</Text>
                                </Pressable>
                            </>
                            )}
                        </View>
                    </View>
                    </Pressable>
                </Modal>
            )
        }
    }

    const deleteRecipe = async () => {
        setDeleting(true);
        const data = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.recipe_id)
        console.log(data)
        setDeleting(false)
        navigation.navigate('Your recipes', {action: "delete" + recipe.recipe_id})
    }

    return (
        <SafeAreaView style={styles.container}>
            {DeleteModal()}
            <View style={styles.recipeTitleBox}>
                <AppHeaderText>{recipe.name}</AppHeaderText>
                {isOwnRecipe ? <></> :  <Text style={[styles.lowImpactText, {marginLeft: 8}]}>by {creatorName}</Text>}
            </View>
            <View style={[styles.descriptorsParent, {marginLeft: 8}]}>
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
                        (<FLTextInput
                        editable={false}
                        defaultValue={recipe.desc}
                        label="Description"
                        />) : 
                        (<Text style={[styles.lowImpactText, {margin: 8}]}>No description added</Text>)}
                    </View>
                    {<View>
                        <Text style={[styles.lowImpactText, {marginLeft: 8}]}>Meals</Text>
                        <Multiselect
                        data={mealTypes}
                        editable={false}
                        />
                    </View>}
                    <View>
                        {recipe.steps ? (
                        <Steps
                        editable={false}
                        steps={recipe.steps}
                        />
                        ) : (
                            <Text style={[styles.lowImpactText, {margin: 8}]}>No steps added</Text>
                        )}
                    </View>
                    
                </>
            )}
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setDeleteModalOpen(true)}>
                <Image
                style={styles.addButton}
                source={assets.delete}
                />
            </TouchableOpacity>
        </SafeAreaView>
        
    )
}

export default Recipe;