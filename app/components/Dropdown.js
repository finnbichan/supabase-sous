import { View, Text, TextInput, FlatList, Pressable, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import React, { useState, useRef } from 'react';

dropdownStyles = StyleSheet.create({
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 4,
        padding: 2,
        flexDirection: "row",
        alignItems: "center"
      },
      overlay: {
        height: '100%',
        width: "100%"
      },
      dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        marginHorizontal: 8
      },
      item: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderBottomWidth: 1,
      },
      icons: {
        maxWidth: 37.5,
        maxHeight: 37.5,
        marginLeft: "auto"
      },
      labelText: {
        marginLeft:4
      }
});

const Dropdown = ({ label, data, onSelect }) => {

    const [visible, setVisible] = useState(false);

    const DropdownButton = useRef();
    const [dropdownTop, setDropdownTop] = useState(0);

    const openDropdown = () => {
        DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
          setDropdownTop(py + h);
        });
        setVisible(true);
    };

    const toggleDropdown = () => {
        visible ? setVisible(!visible) : openDropdown();
    };

    const [selected, setSelected] = useState(undefined);

    const onItemPress = (item) => {
        setSelected(item);
        onSelect(item);
        setVisible(false);
      };

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity style={dropdownStyles.item} onPress={() => onItemPress(item)}>
                <Text>{item.label}</Text>
            </TouchableOpacity>
        )
    }

    const renderDropdown = () => {
        if (visible) {
            return (
                <Modal visible={visible} transparent animationType='none'>
                    <Pressable
                    style={dropdownStyles.overlay}
                    onPress={() => setVisible(false)}
                    >
                     <View style={[dropdownStyles.dropdown, {top: dropdownTop}]}>
                        <FlatList
                        data={data}
                        renderItem={renderItem}
                        />
                     </View>
                    </Pressable>
                </Modal>
            );
        }
    };

    return (
        <TouchableOpacity
        ref={DropdownButton}
        onPress={toggleDropdown}
        style={dropdownStyles.input}
        >
            {renderDropdown()}
            <Text style={dropdownStyles.labelText}>{(selected && selected.label) || label}</Text>
            <Image
            style={dropdownStyles.icons}
            source={require('../../assets/dropdown_arrow.png')}
            />
        </TouchableOpacity>
    )
}

export default Dropdown;  