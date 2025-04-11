import {StyleSheet, Text, TouchableOpacity, Image, View } from 'react-native';
import React from 'react';
import { styles } from '../styles/Common';
import FLTextInput from './FloatingLabelInput';

const stepStyles = StyleSheet.create({
    button: {
        marginHorizontal: 8,
        alignSelf: 'flex-end',
        backgroundColor: '#222222',
        borderRadius: 4,
        marginVertical: 8,
        marginHorizontal: 12,
    },
    icon: {
        height: 32,
        width: 32
    },
    text: {
        color: '#fff',
        fontSize: 18
    },
    stepContainer : {
        flexDirection: 'row',
    }
})


const Steps = ({steps, onAddition, onChangeText, onRemove, editable}) => {
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
                    style={stepStyles.button}
                    onPress={onAddition}
                    >
                        <Image
                        style={stepStyles.icon}
                        source={require('../../assets/add.png')}
                        />
                    </TouchableOpacity>
                    ):(<></>)}
                </>)
}


const Step = ({number, totalNumber, value, onChangeText, onRemove, editable}) => {
    return ( 
        <View style={stepStyles.stepContainer}>
            <FLTextInput
            onChangeTextProp={(text) => onChangeText(number, text)}
            defaultValue={value}
            editable={editable}
            label={"Step " + (number + 1)}
            />
            {totalNumber > 1 && editable ? (
                <TouchableOpacity
                style={[stepStyles.button, {zIndex: 1, position: 'absolute', right: 0, top: 16}]}
                onPress={() => onRemove(number)}
                >
                    <Image
                        style={stepStyles.icon}
                        source={require('../../assets/cross.png')}
                        />
                </TouchableOpacity>
            ):(<></>)}
        </View>
    )
}

export default Steps;