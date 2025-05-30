import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';

const CollapsibleSection = ({ title, open, childrenIfOpen, childrenIfClosed }) => {
    const { colours } = useTheme();
    const styles = StyleSheet.create({
        openContainer: {
            borderRadius: 5,
            overflow: 'hidden'
        },
        closedContainer: {
            backgroundColor: colours.card,
            borderRadius: 5,
            overflow: 'hidden',
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
            color: colours.text,
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
    const [collapsed, setCollapsed] = useState(open);
    const { assets } = useTheme();  

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    }; 

    return (
        <View style={collapsed ? styles.closedContainer : styles.openContainer}>
            <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
                <Text style={styles.largeText}>{title}</Text>
                <Image
                style={styles.image}
                source={collapsed ? assets.down : assets.up}
                />
            </TouchableOpacity>
            {collapsed ? ( 
                <View style={styles.content}>{childrenIfClosed}</View>
            ) : (
            <View style={styles.content}>{childrenIfOpen}</View>
            )}
        </View>
    );
};



export default CollapsibleSection;