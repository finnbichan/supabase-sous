import { Modal, Pressable, View, TextInput, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../Contexts';
import { supabase } from '../../supabase';
import { styles } from '../styles/Common';

const modalStyles = StyleSheet.create({
    overlay: {
        height: '100%',
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    modal: {
        backgroundColor: '#222222',
        padding: 20,
        width: '90%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: '300',
        position: 'absolute',
        borderRadius: 8,
        flexGrow: 0
      },
      searchBox: {
        backgroundColor: '#181818',
        borderRadius: 4,
        padding:2,
        width: '100%',
        height: '100%',
        color: '#fff',
        margin: 10,
      },
      modalTitle: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 4,
        textAlign: 'left',
        
      }
})

const SearchModal = ( {searchModalOpen, setSearchModalOpen} ) => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    const session = useContext(AuthContext);

    //workaround https://github.com/callstack/react-native-paper/issues/4456
    const handleInputAutofocus = () => {
        const timeout = setTimeout(()=>{
          inputRef.current.focus();
        }, 10)
        return ()=>clearTimeout(timeout)
    }
    const searchRecipes = async (text) => {
        setLoading(true);
        console.log("searching for", text)
        const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('user_id', session.user.id)
            .textSearch('recipe_name', text);
        if (error) {
            console.error(error);
        } else {
            console.log("search results", data);
            setSearchResults(data);
        }
        setLoading(false);
    }

   if (searchModalOpen) {
               return (
                   <Modal 
                   visible={searchModalOpen} 
                   animationType='none'
                   transparent
                   onShow={handleInputAutofocus}
                   >
                       <Pressable
                       style={modalStyles.overlay}
                       onPress={() => setSearchModalOpen(false)}
                       />
                       <KeyboardAvoidingView style={modalStyles.modal}>
                            <Text style={modalStyles.modalTitle}>Search your recipes</Text>
                            <TextInput
                            ref={(ref)=>inputRef.current=ref} 
                            style={modalStyles.searchBox}
                            onChangeText={(text) => {
                                setSearchText(text);
                                console.log("trigger")
                                searchRecipes(text);}}
                            />
                       </KeyboardAvoidingView>
                   </Modal>
               )
           }
}

export default SearchModal;