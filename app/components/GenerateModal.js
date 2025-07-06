import { Modal, Pressable, View, TextInput, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../Contexts';
import { supabase } from '../../supabase';
import useStyles from '../styles/Common';
import RecipeBase from './RecipeBase';
import { useTheme } from '@react-navigation/native';
import AppHeaderText from './AppHeaderText';
import Dropdown from './Dropdown';


const GenerateModal = ({genModalOpen, setGenModalOpen}) => {
    const [loading, setLoading] = useState(false);
    const [plannedRecipes, setPlannedRecipes] = useState([]);
    const { assets, colours } = useTheme();
    const styles = useStyles();
    const todaysDate = new Date();
    const session = useContext(AuthContext);

    const createDateArray = () => {
        let dateArray = [];
        for(let i = 0; i < 14; i++){
            let date = new Date() 
            date.setDate(todaysDate.getDate() + i)
            dateArray.push(date.toISOString().slice(0,10))
        }
        return dateArray
    }

    const dateArray = createDateArray();

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
            setPlannedRecipes(data)
        }
        setLoading(false);
    }



    useEffect(() => {
        if (genModalOpen) {
            setLoading(true);
            getPlannedRecipes();
        }}, [genModalOpen]);

    const modalStyles = StyleSheet.create({
        overlay: {
            height: '100%',
            width: "100%",
            justifyContent: 'flex-start',
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
            marginTop: '200',
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
                            <Dropdown
                            value={dateArray[0]}
                            label="Start date"
                            data={dateArray.map((date, idx) => {
                                return {id: idx, label: String(date)}
                            })}
                            onSelect={()=>console.log("wah")}
                            />
                        )}
                       </View>
                   </Modal>
               )
           }
}

export default GenerateModal;