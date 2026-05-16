import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import useStyles from '../styles/Common';

const FloatingDrawerButton = () => {
    const navigation = useNavigation();
    const { assets, colours } = useTheme();
    const styles = useStyles();

    return (
        <TouchableOpacity
        onPress={() => navigation.openDrawer()}
        style={{
            position: 'absolute',
            top: 8,
            right: 12,
            zIndex: 10,
            padding: 10,
            borderRadius: 999,
            backgroundColor: colours.card
        }}
        >
            <Image
            style={styles.icon}
            source={assets.settings}
            />
        </TouchableOpacity>
    );
};

export default FloatingDrawerButton;
