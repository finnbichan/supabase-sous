import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#eaeaea'
    },
    content: {
      alignItems: "center",
      justifyContent: "center"
    },
    title: {
      fontSize: 30,
      marginTop:16,
      fontWeight: "bold",
    },
    input: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      width:100,
      marginTop: 8,
      marginHorizontal: 8,
      borderRadius: 4,
      padding: 2
    },
    buttonsParent: {
      flexDirection: "row"
    },
    buttonParent: {
      alignItems: "center",
    },
    button: {
      backgroundColor: "#000000",
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
    calendarParent: {
      
    }
    }
  );