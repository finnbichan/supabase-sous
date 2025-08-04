import { Modal, Pressable, View, TextInput, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, CacheContext } from '../../Contexts';
import { supabase } from '../../supabase';
import useStyles from '../styles/Common';
import RecipeBase from './RecipeBase';
import { useNavigation, useTheme } from '@react-navigation/native';
import AppHeaderText from './AppHeaderText';
import Dropdown from './Dropdown';
import AppText from './AppText';
import AppButton from './AppButton';


const GenerateModal = ({genModalOpen, setGenModalOpen}) => {
    const createDateArray = () => {
        let dateArray = [];
        for(let i = 0; i < 14; i++){
            let date = new Date() 
            date.setDate(date.getDate() + i)
            dateArray.push(date.toISOString().slice(0,10))
        }
        return dateArray
    }
    const navigation = useNavigation();
    const dateArray = createDateArray();
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(dateArray[0]);
    const [endDate, setEndDate] = useState(dateArray[5]);
    const [plannedRecipes, setPlannedRecipes] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const {cache, setCache} = useContext(CacheContext)
    const { assets, colours } = useTheme();
    const styles = useStyles();
     
    const session = useContext(AuthContext);

    const getPlannedRecipes = async () => {
        console.log("here");
        const { data, error } = await supabase.rpc('get_planned_recipes', {
            p_user_id: session.user.id,
            p_start_date: dateArray[0], 
            p_end_date: dateArray[dateArray.length - 1]
        });
        if (error) {
            console.error("Error fetching planned recipes:", error);
        } else {
            console.log('data', data)
            setPlannedRecipes(data)
        }
        setLoading(false);
    }

    const generateList = async () => {
        setSubmitting(true);
        let listName = startDate + " to " + endDate;
        const { data, error } = await supabase.rpc('create_list', {
            p_user_id: session.user.id,
            p_list_name: listName,
            p_start_date: startDate,
            p_end_date: endDate
        });
        if (error) {
            console.error("Error generating shopping list:", error);
        } else {
            setCache(Date.now());
            console.log('Generated shopping list:', data, data.list_name);
            navigation.navigate('List', {
                list: data.list,
                list_id: data.id,
                list_name: data.list_name,
                prevScreen: "Shopping Lists",});
        }
        setSubmitting(false);
        setGenModalOpen(false);
    }

    useEffect(() => {
        if (genModalOpen && plannedRecipes) {
            setLoading(true);
            getPlannedRecipes();
        }}, [genModalOpen]);

    const modalStyles = StyleSheet.create({
        overlay: {
            height: '100%',
            width: "100%",
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)'
        },
        modal: {
            backgroundColor: colours.background,
            padding: 20,
            width: '90%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: '150',
            position: 'absolute', 
            borderRadius: 8,
            flexGrow: 0
        },
        searchBox: {
            backgroundColor: colours.card,
            borderRadius: 4,
            padding: 2,
            width: '100%',
            height: '50',
            color: colours.text,
            margin: 10,
            paddingHorizontal: 10,
            fontSize: 16
        },
        modalTitle: {
            color: colours.text,
            fontSize: 18,
            marginBottom: 4,
            textAlign: 'left',
        },
        itemContainer: {
            backgroundColor: colours.card,
            borderRadius: 4,
            padding: 4,
            margin: 1,
            flexDirection: 'row',
            flexGrow: 1,
            maxWidth: '99%',
            marginBottom: 2,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        addIcon: {
            height: 32,
            width: 32,
            marginHorizontal: 8
        },
        recipeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: colours.card,
            borderRadius: 4,
            marginVertical: 2,
            padding: 4,
            alignItems: 'center'
        }
    })

    console.log(dateArray.indexOf(startDate), dateArray.indexOf(endDate), dateArray.slice(dateArray.indexOf(startDate), dateArray.indexOf(endDate)+1))

   if (genModalOpen) {
               return (
                   <Modal 
                   visible={genModalOpen} 
                   animationType='none'
                   transparent
                   >
                       <Pressable
                       style={modalStyles.overlay}
                       onPress={() => {setGenModalOpen(false)}}
                       />
                       <View style={modalStyles.modal}>
                        <AppHeaderText>Generate a shopping list</AppHeaderText>
                        { loading ? <ActivityIndicator /> : (
                            <>  
                                <Text style={[styles.lowImpactText, {alignSelf: 'flex-start', marginLeft: 8, marginBottom: '-10'}]}>From</Text>
                                <Dropdown
                                value={0}
                                label="Start date"
                                data={dateArray.map((date, idx) => {
                                    return {id: idx, label: String(date)}
                                })}
                                onSelect={(item) => setStartDate(dateArray[item.id])}
                                />
                                <Text style={[styles.lowImpactText, {alignSelf: 'flex-start', marginBottom: '-10', marginLeft: 8, marginTop: 10}]}>to</Text>
                                <Dropdown
                                value={5}
                                label="End date"
                                data={dateArray.map((date, idx) => {
                                    return {id: idx, label: String(date)}
                                })}
                                onSelect={(item) => setEndDate(dateArray[item.id])}
                                />
                                
                               <View style={{width: '100%', marginLeft: '-8'}}>
                                    <AppText>Meals included:</AppText>
                                    <FlatList
                                        data={dateArray.slice(dateArray.indexOf(startDate), dateArray.indexOf(endDate)+1)}
                                        style={{marginLeft: 16}}
                                        renderItem={(item) => {
                                            const meals = plannedRecipes.filter(d => item.item == d.date).map(r => r.recipe.name)
                                            console.log("meals", meals)
                                            return (
                                                <>
                                                {meals[0] ? (
                                                    <Text style={styles.lowImpactText}>{meals.join(', ')}</Text>
                                                ) : (
                                                    <></>
                                                )}
                                                </>
                                            )
                                        }}
                                    />
                                </View>
                                {submitting ? <ActivityIndicator /> : (
                               <AppButton
                                label="Generate"
                                onPress={generateList}
                                />
                                )}
                            </>
                        )}
                       </View>
                   </Modal>
               )
           }
}

export default GenerateModal;