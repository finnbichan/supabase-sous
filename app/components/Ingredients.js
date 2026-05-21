import { StyleSheet, Text, TouchableOpacity, Image, View, TextInput } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import { useTheme } from '@react-navigation/native';

const Ingredients = ({
    ingredients,
    onAddition,
    onChangeText,
    onRemove,
    editable=true,
    firstPlaceholder='Add some ingredients...',
    nextPlaceholder='Add some more...'
}) => {
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
                        firstPlaceholder={firstPlaceholder}
                        nextPlaceholder={nextPlaceholder}
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


const Ingredient = ({number, totalNumber, value, onChangeText, onRemove, editable, firstPlaceholder, nextPlaceholder}) => {
    const { assets, colours } = useTheme();
    const styles = useStyles();
    const placeholder = number === 0 ? firstPlaceholder : nextPlaceholder;
    const ingredientStyles = StyleSheet.create({
        container: {
            width: '100%',
            position: 'relative',
            marginTop: 8,
            marginBottom: 8
        },
        input: {
            width: '95%',
            backgroundColor: colours.card,
            borderRadius: 16,
            color: colours.text,
            marginHorizontal: 8,
            paddingHorizontal: 14,
            paddingTop: 16,
            paddingBottom: 16,
            paddingRight: totalNumber > 1 && editable ? 48 : 14,
            minHeight: 46,
            fontSize: 16
        },
        removeButton: {
            zIndex: 1,
            position: 'absolute',
            right: 8,
            top: 3
        }
    });

    return ( 
        <View style={ingredientStyles.container}>
            <TextInput
                style={ingredientStyles.input}
                value={value}
                onChangeText={(text) => onChangeText(number, text)}
                placeholder={placeholder}
                placeholderTextColor={colours.secondaryText}
                editable={editable}
                multiline={true}
            />

            {totalNumber > 1 && editable ? (
                <TouchableOpacity
                    style={[styles.stepButton, ingredientStyles.removeButton]}
                    onPress={() => onRemove(number)}
                >
                    <Image
                        style={styles.icon}
                        source={assets.cross}
                    />
                </TouchableOpacity>
            ) : null}
        </View>
    )
}

export default Ingredients;
