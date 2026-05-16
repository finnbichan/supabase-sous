import { View, Text, FlatList, Pressable, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@react-navigation/native';

const Dropdown = ({ value, label, data, onSelect, compact = false, style, loading = false }) => {
  const { colours, assets } = useTheme();
  const dropdownStyles = StyleSheet.create({
        input: {
            backgroundColor: colours.card,
            marginHorizontal: 8,
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: "center",
            width: '95%',
            marginTop: 20,
            minHeight: 40
        },
        compactInput: {
            width: 'auto',
            flex: 1,
            minWidth: 0,
            marginHorizontal: 0,
            marginTop: 0,
            paddingHorizontal: 14,
            borderRadius: 999
        },
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(12, 16, 24, 0.18)'
        },
        dropdown: {
            position: 'absolute',
            left: 12,
            right: 12,
            backgroundColor: colours.background,
            borderRadius: 24,
            padding: 10,
            maxHeight: 320,
            shadowColor: '#000000',
            shadowRadius: 18,
            shadowOffset: { height: 10, width: 0 },
            shadowOpacity: 0.18,
            elevation: 12
        },
        listContent: {
            paddingTop: 4
        },
        item: {
            paddingHorizontal: 14,
            paddingVertical: 14,
            backgroundColor: colours.card,
            borderRadius: 16,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center'
        },
        selectedItem: {
            backgroundColor: colours.layer
        },
        disabledItem: {
            opacity: 0.45
        },
        itemText: {
            color: colours.text,
            fontSize: 16
        },
        selectedItemText: {
            color: colours.text
        },
        itemMeta: {
            marginLeft: 'auto',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
        },
        selectedBadge: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: colours.background
        },
        selectedBadgeText: {
            color: colours.secondaryText,
            fontSize: 11,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.6
        },
        disabledBadge: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: colours.background
        },
        disabledBadgeText: {
            color: colours.secondaryText,
            fontSize: 11,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 0.6
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 6,
            paddingBottom: 10
        },
        icons: {
            maxWidth: 37.5,
            maxHeight: 37.5,
            marginLeft: 'auto'
        },
        chevronOpen: {
            transform: [{ rotate: '180deg' }]
        },
        labelText: {
            marginLeft: 4,
            fontSize: 15
        },
        compactLabelText: {
            marginLeft: 0,
            marginRight: 8
        }
    });
    const [visible, setVisible] = useState(false);
    const DropdownButton = useRef();
    const [dropdownTop, setDropdownTop] = useState(0);

    const openDropdown = () => {
        DropdownButton.current?.measureInWindow((_x, y, _w, h) => {
            setDropdownTop(y + h + 2);
            setVisible(true);
        });
    };

    const toggleDropdown = () => {
        visible ? setVisible(!visible) : openDropdown();
    };

    const [selected, setSelected] = useState(data[value]);

    useEffect(() => {
        setSelected(data[value]);
    }, [data, value]);

    const onItemPress = (item) => {
        if (item.disabled) {
            return;
        }
        setSelected(item);
        onSelect(item);
        setVisible(false);
      };

    const renderItem = ({item}) => {
        const isSelected = selected?.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    dropdownStyles.item,
                    isSelected && dropdownStyles.selectedItem,
                    item.disabled && dropdownStyles.disabledItem
                ]}
                onPress={() => onItemPress(item)}
                disabled={item.disabled}
            >
                <Text style={[dropdownStyles.itemText, isSelected && dropdownStyles.selectedItemText]}>
                    {item.label}
                </Text>
                <View style={dropdownStyles.itemMeta}>
                    {isSelected ? (
                        <View style={dropdownStyles.selectedBadge}>
                            <Text style={dropdownStyles.selectedBadgeText}>Selected</Text>
                        </View>
                    ) : null}
                    {item.disabled ? (
                        <View style={dropdownStyles.disabledBadge}>
                            <Text style={dropdownStyles.disabledBadgeText}>Premium</Text>
                        </View>
                    ) : null}
                </View>
            </TouchableOpacity>
        )
    }

    const renderDropdown = () => {
        if (visible) {
            return (
                <Modal visible={visible} transparent animationType='none'>
                    <View style={dropdownStyles.overlay}>
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={() => setVisible(false)}
                        />
                        <View style={[dropdownStyles.dropdown, { top: dropdownTop }]}>
                        {loading ? (
                            <View style={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size="small" color={colours.text} />
                            </View>
                        ) : (
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                contentContainerStyle={dropdownStyles.listContent}
                                showsVerticalScrollIndicator={false}
                                nestedScrollEnabled={true}
                            />
                        )}
                        </View>
                    </View>
                </Modal>
            );
        }
    };

    return (
        <TouchableOpacity
        ref={DropdownButton}
        onPress={toggleDropdown}
        style={[dropdownStyles.input, compact && dropdownStyles.compactInput, style]}
        disabled={loading}
        >
            {renderDropdown()}
            {loading ? (
                <ActivityIndicator size="small" color={colours.text} />
            ) : (
                <>
                    <Text style={[dropdownStyles.labelText, compact && dropdownStyles.compactLabelText, {color: selected ? colours.text : colours.secondaryText}]}>{(selected && selected.label) || label}</Text>
                    <Image
                        style={[dropdownStyles.icons, visible && dropdownStyles.chevronOpen]}
                        source={assets.dropdown_arrow}
                    />
                </>
            )}
        </TouchableOpacity>
    )
    
}

export default Dropdown;  
