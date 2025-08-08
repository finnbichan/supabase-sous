import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {LinearTransition, FadingTransition, useAnimatedStyle, interpolate, interpolateColor} from 'react-native-reanimated';

const collapsibleStyles = StyleSheet.create({
        collapsibleContainer: {
            borderRadius: 5,
            overflow: 'hidden'
        },
        header: {
            paddingLeft: 10,
            paddingTop: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '99%'
        },
        title: {
            fontSize: 16,
            color: '#fff',
        },
        content: {
            paddingLeft: 10,
            paddingBottom: 10
        },
        largeText: {
            fontSize: 20,
            fontWeight: 'heavy',
            fontFamily: ''
        },
        image: {
            height: 32,
            width: 32,
            marginHorizontal: 8
        },
        topRow: {
            
        }
    });

const CollapsibleSection = ({ title, open, childrenIfOpen, childrenIfClosed }) => {
    const { colours, assets } = useTheme();
    const [collapsed, setCollapsed] = useState(open);  

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }; 

    return (
        <Animated.View  
        style={[collapsibleStyles.collapsibleContainer, {backgroundColor: collapsed ? colours.card : null, transitionProperty: 'backgroundColor', transitionDuration: '2s'}]}
        layout={LinearTransition}
        >
            <TouchableOpacity onPress={toggleCollapse} style={collapsibleStyles.header}>
                <Text style={[collapsibleStyles.largeText, {color: colours.text}]}>{title}</Text>
                <Image
                style={collapsibleStyles.image}
                source={collapsed ? assets.down : assets.up}
                />
            </TouchableOpacity>
            {collapsed ? ( 
                <View style={collapsibleStyles.content}>{childrenIfClosed}</View>
            ) : (
            <View style={collapsibleStyles.content}>{childrenIfOpen}</View>
            )}
        </Animated.View>
    );
};



export default CollapsibleSection;