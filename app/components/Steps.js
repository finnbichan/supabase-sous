import {Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '../styles/Common';

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
                    style={styles.button}
                    onPress={onAddition}
                    >
                        <Text style={styles.text}>Add another</Text>
                    </TouchableOpacity>
                    ):(<></>)}
                </>)
}


const Step = ({number, totalNumber, value, onChangeText, onRemove, editable}) => {
    return ( 
        <>
            <Text style={styles.text}>Step {number + 1}</Text>
            <TextInput
            style={styles.input}
            onChangeText={(text) => onChangeText(number, text)}
            value={value}
            editable={editable}
            />
            {totalNumber > 1 && editable ? (
                <TouchableOpacity
                style={styles.button}
                onPress={() => onRemove(number)}
                >
                    <Text style={styles.text}>Remove</Text>
                </TouchableOpacity>
            ):(<></>)}
        </>
    )
}

export default Steps;