import { View, Text, TextInput, FlatList, Pressable, Image, TouchableOpacity, Icon } from 'react-native';
import React from 'react';
import { styles } from '../styles/Common';

const days = [{"date":"2024-05-09", "recipe":"True"}, {"date":"2024-05-10", "recipe":"false"}, {"date":"2024-05-11", "recipe":"true"},  {"date":"2024-05-12", "recipe":"true"},  {"date":"2024-05-13", "recipe":"true"},  {"date":"2024-05-14", "recipe":"true"},  {"date":"2024-05-15", "recipe":"true"}];

const renderDay = ( {item} ) => {
    return (
        <>
        {item.recipe == "true" ? (
            <View style={styles.calendarCard}>
                <Text>{item.date}</Text>
                <View style={styles.recipeCard}>
                    <Text>Pesto Pasta</Text>
                    <View style={styles.recipeButtons}>
                        <TouchableOpacity style={styles.circularButton}>
                            <Image
                            style={styles.icons}
                            source={require('../../assets/refresh.png')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.circularButton}>
                            <Image
                            style={styles.icons}
                            source={require('../../assets/delete.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ) : (
            <View style={styles.calendarCard}>
                <Text>{item.date}</Text>
                <View style={styles.recipeCard}>
                    <TextInput
                    placeholder="Search for a recipe..."
                    />
                    <View style={styles.recipeButtons}>
                        <TouchableOpacity style={styles.circularButton}>
                            <Image
                            style={styles.icons}
                            source={require('../../assets/generate.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
        }
        </>
    );
}

const Calendar = () => {
    return (
        <View style={styles.calendarParent}>
            <FlatList
                data={days}
                renderItem={renderDay}
                windowSize="5"
                style={styles.calendar}
            />
        </View>
    );
}

export default Calendar;    