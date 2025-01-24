import { View, Text, TextInput, FlatList, Pressable, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import React, { useState, useRef } from 'react';

dropdownStyles = StyleSheet.create({
    input: {
        borderColor: '#ffffff',
        borderWidth: 1,
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 4,
        padding: 2,
        flexDirection: "row",
        alignItems: "center",
        color: '#fff'
      },
      overlay: {
        height: '100%',
        width: "100%"
      },
      dropdown: {
        position: 'absolute',
        borderColor: '#fff',
        width: '90%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        marginHorizontal: 8,
        color: '#fff',
        backgroundColor: '#222222'
      },
      item: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderBottomWidth: 1,
        color: '#fff'
      },
      icons: {
        maxWidth: 37.5,
        maxHeight: 37.5,
        marginLeft: "auto"
      },
      labelText: {
        marginLeft:4,
        color: '#fff'
      },
      text: {
        color: '#fff'
      }
});

const Dropdown = ({ value, label, data, onSelect }) => {

    console.log("data", data)

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

    const [selected, setSelected] = useState(data[value]);

    const onItemPress = (item) => {
        setSelected(item);
        onSelect(item);
        setVisible(false);
      };

    const renderItem = ({item}) => {
        return (
            <TouchableOpacity style={dropdownStyles.item} onPress={() => onItemPress(item)}>
                <Text style={dropdownStyles.text}>{item.label}</Text>
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