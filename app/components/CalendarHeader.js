import React, { useState, useContext, use } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../Contexts';
import AppHeaderText from './AppHeaderText';
import AppText from './AppText';
import useStyles from '../styles/Common';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import GeneratePlanModal from './GeneratePlanModal';

const CalendarHeader = ({historyOpen, onHistoryOpen}) => {
    const [genModalOpen, setGenModalOpen] = useState(false);
    const styles = useStyles();
    const { colours, assets } = useTheme();
    const session = useContext(AuthContext);
    const navigation = useNavigation();
    const time = Number((new Date).getHours());
    var greeting = "Hey";
    if (time < 12) {greeting = "Morning"}
    else if (time >= 18) {greeting = "Evening"}
    else {greeting = "Afternoon"};
    
    return (
            <View style={headerStyles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4}}>
                    <AppHeaderText>{greeting}, {session.user.user_metadata.display_name}</AppHeaderText>
                    <TouchableOpacity
                    style={{flexDirection: 'row', padding: 10, borderRadius: 8}}
                    onPress={() => navigation.openDrawer()}
                    >
                        <Image
                        style={styles.icon}
                        source={assets.settings}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 24, color: colours.text, paddingHorizontal: 12, paddingTop: 4}}>
                        Your meal plan
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                        <TouchableOpacity
                        style={{flexDirection: 'row', padding: 8, marginRight: 12}}
                        onPress={() => setGenModalOpen(true)}
                        >   
                            <Image style={styles.icon} source={assets.calendar_gen}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={{flexDirection: 'row', padding: 10, borderRadius: 8, backgroundColor: historyOpen ? colours.card : colours.background}}
                        onPress={onHistoryOpen}
                        >   
                            <Image style={styles.icon} source={assets.history}/>
                            <Image style={[styles.icon, {marginLeft: '-8'}]} source={historyOpen ? assets.up : assets.down}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <GeneratePlanModal
                    genModalOpen={genModalOpen}
                    setGenModalOpen={setGenModalOpen}
                />
            </View>
    );
}; 

const headerStyles = StyleSheet.create({
    container: {
        marginTop: 4,
        marginRight: 4
    },
    greeting: {
        fontSize: 20,
        marginBottom: 10
    },
    shoppingButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    shoppingButtonText: {
        color: '#000',
    },
    instructionText: {
        marginTop: 20,
        marginBottom: 10,
        fontSize: 16,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    picker: {
        flex: 1,
        height: 50,
    },
});

export default CalendarHeader;