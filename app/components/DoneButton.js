import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const doneStyles = StyleSheet.create({
    editButton: {
        height: 32,
        width: 32,
        marginRight: 10
    }
})

const DoneButton = ( { onSubmit, isSubmitting} ) => {
    return (
        <>
            {isSubmitting ? (<ActivityIndicator style={doneStyles.editButton}/>) : (
                <>
                    <TouchableOpacity
                    onPress={onSubmit}>
                        <Image 
                        style={doneStyles.editButton}
                        source={require('../../assets/tick.png')}
                        />
                    </TouchableOpacity>
                </>
            )}
        </>
    )
}

export default DoneButton;