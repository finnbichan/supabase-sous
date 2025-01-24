import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CollapsibleSection = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(true);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
                <Text style={styles.title}>{title}</Text>
            </TouchableOpacity>
            {!collapsed && <View style={styles.content}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#222222',
        padding: 10,
    },
    title: {
        fontSize: 16,
        color: '#fff',
    },
    content: {
        padding: 10,
    },
});

export default CollapsibleSection;