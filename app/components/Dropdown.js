import { View, Text, TextInput, FlatList, Pressable, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import React, { useState, useRef } from 'react';

dropdownStyles = StyleSheet.create({
    input: {
        backgroundColor: '#222222',
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 4,
        padding: 2,
        flexDirection: "row",
        alignItems: "center",
        color: '#fff',
        width: '95%',
        marginTop: 20,
      },
      overlay: {
        height: '100%',
        width: "100%"
      },
      dropdown: {
        position: 'absolute',
        borderColor: '#fff',
        width: '93%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
        marginHorizontal: 8,
        color: '#fff',
        backgroundColor: '#181818',
        alignSelf: 'center',
        marginTop: '0',
        marginBottom: '-2',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        paddingTop: 2,
        left: 5
      },
      item: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        color: '#fff',
        backgroundColor: '#222222',
        borderRadius: 4,
        marginBottom: 4,

      },
      icons: {
        maxWidth: 37.5,
        maxHeight: 37.5,
        marginLeft: "auto"
      },
      labelText: {
        marginLeft:4
      },
      text: {
        color: '#fff'
      }
});

const Dropdown = ({ value, label, data, onSelect }) => {

    const [visible, setVisible] = useState(false);

    const DropdownButton = useRef();
    const [dropdownTop, setDropdownTop] = useState(0);

    const openDropdown = () => {
        DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
          setDropdownTop(py + h - 50);
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
            <Text style={[dropdownStyles.labelText, {color: selected ? '#fff' : '#b3b3b3'}]}>{(selected && selected.label) || label}</Text>
            <Image
            style={dropdownStyles.icons}
            source={require('../../assets/dropdown_arrow.png')}
            />
        </TouchableOpacity>
    )
}

export default Dropdown;  