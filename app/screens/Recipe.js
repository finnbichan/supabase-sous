import { View, Text, Pressable, SafeAreaView, TouchableOpacity,ActivityIndicator, Image, TouchableWithoutFeedback, Modal } from 'react-native';
import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
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
    console.log(route.params.recipe);
    const [recipe, setRecipe] = useState(route.params.recipe);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [creatorName, setCreatorName] = useState("");
    const session = useContext(AuthContext);
    const isOwnRecipe = recipe.user_id == session.user.id;
    const { assets } = useTheme();
    const styles = useStyles();
    const mealTypeList = [
        {id: 1, name: "Breakfast"},
        {id: 2, name: "Lunch"},
        {id: 3, name: "Dinner"}
    ];
    const mealTypes = mealTypeList.map((x) => {
            return {
                ...x,
                selected: recipe.meals.includes(x.id)
            }})
        
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
        if(isOwnRecipe) {
            navigation.setOptions({
                headerRight: () => (
                    <EditButton nav={navigation} target={"Add a recipe"} params={{prevScreen: "Recipe", recipe: recipe}}/>
                )
                });
            }
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
            {recipe.image_uri ? (
                <Image
                source={{uri : recipe.image_uri}}
                style={{height: 300, width: '100%'}}
                loadingIndicatorSource={<ActivityIndicator />}
                />
            ):(<></>)}
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
            <View>
                {recipe.desc ? (
                    <FLTextInput
                    editable={false}
                    defaultValue={recipe.desc}
                    label="Description"
                    />
                ) : (
                    <Text style={[styles.lowImpactText, {margin: 8}]}>No description added</Text>
                )
                }
            </View>
            {recipe.meals.map((x, i)=> {
            return (
                <View
                style={[styles.multiItemContainer, {backgroundColor: '#00AEFF', alignSelf: 'flex-start'}]}
                key={i}
                >
                    <Text style={styles.text}>{mealTypeList[i].name}</Text>
                </View>
            )
        })}
            {//TODO make collapsible
            }
            <View>
                {recipe.ingredients ? (
                <Steps
                editable={false}
                steps={JSON.parse(recipe.ingredients)}
                />
                ) : (
                    <Text style={[styles.lowImpactText, {margin: 8}]}>No ingredients added</Text>
                )}
            </View>
            <View>
                {recipe.steps ? (
                <Steps
                editable={false}
                steps={JSON.parse(recipe.steps)}
                />
                ) : (
                    <Text style={[styles.lowImpactText, {margin: 8}]}>No steps added</Text>
                )}
            </View>
            {/*
            TODO move delete to edit screen
            <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setDeleteModalOpen(true)}>
                <Image
                style={styles.addButton}
                source={assets.delete}
                />
            </TouchableOpacity>
            */}
        </SafeAreaView>
        
    )
}

export default Recipe;