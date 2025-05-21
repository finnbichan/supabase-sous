import { Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

const doneStyles = StyleSheet.create({
    editButton: {
        height: 32,
        width: 32,
        marginRight: 10
    }
})

const DoneButton = ( { onSubmit, isSubmitting} ) => {
    const { assets } = useTheme();
    return (
        <>
            {isSubmitting ? (<ActivityIndicator style={doneStyles.editButton}/>) : (
                <>
                    <TouchableOpacity
                    onPress={onSubmit}>
                        <Image 
                        style={doneStyles.editButton}
                        source={assets.tick}
                        />
                    </TouchableOpacity>
                </>
            )}
        </>
    )
}

export default DoneButton;