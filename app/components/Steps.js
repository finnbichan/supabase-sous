import {StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import React from 'react';
import useStyles from '../styles/Common';
import FLTextInput from './FloatingLabelInput';
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

    return ( 
        <View style={{flexDirection: 'row'}}>
            <FLTextInput
            onChangeTextProp={(text) => onChangeText(number, text)}
            defaultValue={value}
            editable={editable}
            label={"Step " + (number + 1)}
            />
            {totalNumber > 1 && editable ? (
                <TouchableOpacity
                style={[styles.stepButton, {zIndex: 1, position: 'absolute', right: 0, top: 16}]}
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