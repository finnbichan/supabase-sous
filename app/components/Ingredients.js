import {TouchableOpacity, Image, View, TextInput } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import { useTheme } from '@react-navigation/native';

const Ingredients = ({ingredients, onAddition, onChangeText, onRemove, editable=true}) => {
    const { assets } = useTheme();
    const styles = useStyles();
    
    return (<>
                {ingredients.map((x, i) => {
                    return (
                        <Ingredient
                        key={i}
                        number={i}
                        totalNumber={ingredients.length}
                        value={x}
                        onChangeText={onChangeText}
                        onRemove={onRemove}
                        editable={editable}
                        />
                    )
                })}
                {ingredients.length < 100 && editable ? (
                    <TouchableOpacity
                    style={styles.stepButton}
                    onPress={onAddition}
                    >
                        <Image
                        style={styles.icon}
                        source={assets.add}
                        />
                    </TouchableOpacity>
                    ):(<></>)}
                </>)
}


const Ingredient = ({number, totalNumber, value, onChangeText, onRemove, editable}) => {
    const { assets, colours } = useTheme();
    const styles = useStyles();
    const placeholder = number === 0 ? 'Add some ingredients...': '';

    return ( 
        <View style={{flexDirection: 'row'}}>
            <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => onChangeText(number, text)}
            placeholder={placeholder}
            placeholderTextColor={colours.secondaryText}
            />

            {totalNumber > 1 && editable ? (
                <TouchableOpacity
                style={[styles.stepButton, {zIndex: 1, position: 'absolute', right: 0, top: 0}]}
                onPress={() => onRemove(number)}
                >
                    <Image
                        style={styles.icon}
                        source={assets.cross}
                        />
                </TouchableOpacity>
            ):(<></>)}
        </View>
    )
}

export default Ingredients;