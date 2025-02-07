import { cloneElement } from 'react';
import { StyleSheet } from 'react-native';
import BackButton from '../components/BackButton';

export const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 5,
      backgroundColor: '#121212'
    },
    content: {
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      fontSize: 30,
      marginTop: 10,
      fontWeight: "bold",
      color: '#fff',
      maxWidth: 300,
      textAlign: 'left'
     },
    text: {
      color: '#fff'
    },
    input: {
      overlayColor: '#ffffff',
      borderColor: '#ffffff',
      borderWidth: 1,
      width: '90%',
      marginTop: 8,
      marginHorizontal: 8,
      borderRadius: 4,
      padding: 2,
      color: '#fff'
    },
    buttonsParent: {
      flexDirection: "row"
    },
    buttonParent: {
      alignItems: "center",
    },
    button: {
      borderColor: "#fff",
      backgroundColor: '#222222',
      marginHorizontal: 8,
      borderWidth: 1,
      borderRadius: 4,
      paddingVertical: 4,
      paddingHorizontal: 8
    },
    buttonText: {
      color: "#ffffff"
    },
    helperText: {
      color: "#a9a9a9",
      fontSize: 14,
      marginVertical: 2,
      marginHorizontal: 8,
    },
    logOutButton: {
      backgroundColor: "#b22222",
      borderColor: "#b22222",
      marginHorizontal: 8,
      borderWidth: 1,
      borderRadius: 4,
      paddingVertical: 4,
      paddingHorizontal: 8
    },
    calendar: {
      backgroundColor: "#ffffff",
      borderRadius: 4,
      borderColor: "#000",
      borderWidth: 1,
      width: 400,
      minWidth: "90%",
      height: 320,
      flexGrow: 0,
      marginTop: 8
    },
    calendarCard: {
      borderColor: "#000",
      borderBottomWidth: 1
    },
    recipeCard: {
      flexDirection: 'row'
    },
    circularButton: {
      backgroundColor: "#000000",
      borderWidth: 1,
      borderRadius: '50%',
      marginHorizontal: 8,
      marginVertical: 2,
      width: 40,
      height: 40
    },
    recipeButtons: {
      flexDirection: "row",
      marginLeft: 'auto'
    },
    icons: {
      width: 37.5,
      height: 37.5,
      maxWidth: 37.5,
      maxHeight: 37.5
    },
    recipeList: {
      minWidth: "90%",
      marginBottom: 64
    },
    descriptorsParent: {
      flexDirection: "row",
    },
    descriptors: {
      backgroundColor: "#535353",
      borderRadius: 8,
      marginHorizontal: 2,
      marginVertical: 2,
      paddingHorizontal: 4,
      paddingVertical: 2 
  },
  descriptorText : {
      color: "#FFF"
  },
  overlay: {
    height: '100%',
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    backgroundColor: '#181818',
    borderColor: '#FFF',
    borderRadius: 4,
    borderWidth: 1,
    width: '70%',
    height: '10%',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 4
  },
  userRecipesTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    maxHeight: 70,
    alignItems: 'center'
  },
  recipeTitleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  addButton: {
    maxHeight: 32,
    maxWidth: 32,
    //marginTop: 5
  },
  editButton: {
    maxHeight: 40,
    maxWidth: 40,
    marginTop: 10
  }
    }
  );