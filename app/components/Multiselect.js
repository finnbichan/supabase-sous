import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import React, { use, useState } from 'react';
import { StyleSheet } from 'react-native';  
import AppText from './AppText';
import useStyles from '../styles/Common';
import { useTheme } from '@react-navigation/native';

const multiselectStyles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        borderRadius: 4,
        marginVertical: 4,
        marginHorizontal: 8
    },
    multiselect: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
});

const Multiselect = ( { data, onPress, editable=true } ) => {
    console.log(data)
    return (
    <View style={multiselectStyles.multiselect}>
        {data.map((x, i)=> {
            return (
                <MultiselectItem
                    key={i}
                    item={x}
                    onPress={onPress}
                    editable={editable}
                />
            )
        })}
        </View>
        )
}

const MultiselectItem = ({ item, onPress, editable }) => {
    const { colours } = useTheme();
    const styles = useStyles();
    return (
        <>
        {editable ? (
            <TouchableOpacity
                style={[multiselectStyles.itemContainer, {backgroundColor: item.selected ? '#00AEFF' : colours.card}]}
                onPress={()=>onPress(item.id)}
            >
                <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
        ):(
            <View
            style={[multiselectStyles.itemContainer, {backgroundColor: item.selected ? '#00AEFF' : colours.card}]}
        >
            <Text style={styles.text}>{item.name}</Text>
        </View>
        )}
        </>
    );
};

export default Multiselect;