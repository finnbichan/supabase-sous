import { Animated, TextInput, Text, View, StyleSheet } from 'react-native';
import React, { useState, useRef, useLayoutEffect } from 'react';

const FLInputStyles = StyleSheet.create({
    input: {
        width: '95%',
        marginLeft: 8,
        backgroundColor: '#222222',
        borderRadius: 4,
        color: '#fff',
        marginBottom: 2,
        marginTop: 20,
        paddingRight: 30,
      },
      label: {
        color: '#b3b3b3'
      },
      animatedStyle: {
        zIndex: 1,
        position: 'absolute',
        left: 15
      },

      
})

const FLTextInput = ( {id, label, defaultValue, onChangeTextProp, editable=true} ) => {
    const [value, setValue] = useState(defaultValue);
    const [isUp, setIsUp] = useState(defaultValue ? true : false);

    const moveText = useRef(new Animated.Value(defaultValue ? 1 : 0)).current;
    const inputRef = useRef();

    useLayoutEffect(() => {
      inputRef.current.measure((_fx, _fy, _w, h, _px, py) => {
        setTextPosition(_fy + h - 35);
      });
    }, []);

    const [textPosition, setTextPosition] = useState(0);


    const handleBlur = () => {
        if (!value) {
        setIsUp(false);
        Animated.timing(moveText, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true
          }).start();
        }
    }

    const handleFocus = () => {
        setIsUp(true);
        Animated.timing(moveText, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

    const onChangeText = (text) => {
        setValue(text);
        onChangeTextProp(text);
    }

    const yVal = moveText.interpolate({
        inputRange: [0, 1],
        outputRange: [4, -25],
      });
    
      const animStyle = {
        transform: [
          {
            translateY: yVal,
          },
        ],
      };

    return (
        <>
            <Animated.View style={[FLInputStyles.animatedStyle, animStyle, {top: textPosition}]}>
                <Text style={FLInputStyles.label}>{label}</Text>
            </Animated.View>
            <TextInput
            ref={inputRef}
            id={id}
            style={FLInputStyles.input}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            multiline={true}
            editable={editable}
            />
        </>
    )
}

export default FLTextInput;