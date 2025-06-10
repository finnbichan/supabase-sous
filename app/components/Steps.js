import {StyleSheet, Text, TouchableOpacity, Image, View, TextInput } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import { useTheme } from '@react-navigation/native';

const Steps = ({steps, onAddition, onChangeText, onRemove, editable}) => {
    const { assets } = useTheme();
    const styles = useStyles();
    
    return (<>
                {steps.map((x, i) => {
                    return (
                        <Step
                        key={i}
                        number={i}
                        totalNumber={steps.length}
                        value={x}
                        onChangeText={onChangeText}
                        onRemove={onRemove}
                        editable={editable}
                        />
                    )
                })}
                {steps.length < 10 && editable ? (
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


const Step = ({number, totalNumber, value, onChangeText, onRemove, editable}) => {
    const { assets, colours } = useTheme();
    const styles = useStyles();
    const placeholder = number === 0 ? 'Add some steps...': 'Add some more...';

    return ( 
        <View style={{flexDirection: 'row'}}>
            <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText(number, text)}
            value={value}
            editable={editable}
            placeholder={placeholder}
            placeholderTextColor={colours.secondaryText}
            />
            {totalNumber > 1 && editable ? (
                <TouchableOpacity
                style={[styles.stepButton, {zIndex: 1, position: 'absolute', right: 0}]}
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

export default Steps;