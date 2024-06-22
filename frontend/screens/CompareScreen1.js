import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CompareScreen = () => {
    const [searchKey, setSearchKey] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigation = useNavigation();

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://192.168.1.53:3002/search?q=${searchKey}`);
            // const data = response.data;
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
                if (data.length === 0) {
                    Alert.alert('Not Found', 'Product not found');
                }
            } else {
                setSearchResults([]);
                Alert.alert('Not Found', 'Product not found');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Network Error', 'Network request failed');
        }
    };
    const handlePress = (item) => {
        navigation.navigate('Price Compare', { groceryName: item.groceryName });
    };


  return (
    <SafeAreaView style={styles.container}>
         <View>
            <View style={styles.headercard}>
                <View style={styles.headerContent}>
                    <Text style={styles.headingText}> Price Comparison</Text>
                    <Icon name="cog" size={30} color="#00806C" style={styles.icon} />
                </View>
            </View>
            <View style={styles.container}>
                <View style={[styles.card, styles.searchbar]}>
                    <Icon name="search" size={20} color="#383A49" style={styles.iconsearch} />
                    <TextInput
                        style={styles.searchtulisan}
                        placeholder="Search"
                        value={searchKey}
                        onChangeText={setSearchKey}
                        onSubmitEditing={handleSearch}
                    />
                </View>
            </View>
            <View style={[styles.recently, styles.recentlyContainer]}>
                <Text style={styles.tulisanrecentlysearched}> Recently Searched</Text>
            </View>
            <View style={styles.containermakanan}>
                <FlatList
                    data={searchResults}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={[styles.cardmakanan, styles.searchbar]} onPress={() => handlePress(item.groceryName)}>
                            <Text style={styles.tulisanmakanan}>
                                {item.groceryName} 
                            </Text>
                            <Icon name="plus" size={20} color="#EFC645" style={styles.iconplus} />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headercard: {
        backgroundColor: '#F6E9BE',
        height: 70,
        width: 390,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headingText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
    },
    icon: {
        marginLeft: 30,
    },
    iconsearch: {
        marginLeft: 10,
    },
    iconplus: {
        marginRight: 10,
    },
    tulisanrecentlysearched: {
        fontSize: 20,
        fontWeight: 'medium',
        color: '#000000',
        marginBottom: 10
    },
    tulisanmakanan: {
        fontSize: 17,
        fontWeight: 'medium',
        color: '#000000',
        marginLeft: 25,
        flex: 1,
    },
    recentlyContainer: {
        // marginTop: 10,
        marginLeft: 20,
    },
    recently: {
        color: '#000000',
    },
    containermakanan: {},
    cardmakanan: {
        backgroundColor: '#FFF6D9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 318,
        height: 44,
        borderRadius: 20,
        marginTop: 15,
        marginLeft: 25,
        paddingHorizontal: 10,
    },
    container: {},
    searchtulisan: {
        fontSize: 22,
        marginLeft: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 318,
        height: 44,
        borderRadius: 20,
        margin: 20,
    },
    searchbar: {
        backgroundColor: '#FFF6D9',
    },
    searchtulisan:{
      fontSize: 16
    }
});

export default CompareScreen;
