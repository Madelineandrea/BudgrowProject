import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const screenWidth = Dimensions.get('window').width;

const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);

  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    console.log("Fetching data..."); 
    fetch('http://192.168.1.53:3002/search?q=')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) { 
          console.log("Data fetched:", data); 
          setFoodItems(data);
          const total = data.reduce((total, item) => total + item.groceryPrice, 0);
          setGrandTotal(total);
        } else {
          console.error("Expected an array, but got:", data); 
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleToggleCheck = (index) => {
    const updatedItems = [...foodItems];
    updatedItems[index].checked = !updatedItems[index].checked;
    setFoodItems(updatedItems);
  };

  const handleAddToAnalytics = () => {
    const checkedItems = foodItems.filter(item => item.checked);

    if (checkedItems.length === 0) {
      Alert.alert("No items selected", "Please select items to add to analytics.");
      return;
    }

    fetch('http://192.168.1.53:3002/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkedItems)
    })
      .then(response => response.json())
      .then(data => {
        Alert.alert("Success", "Items added to analytics successfully.");
      })
      .catch(error => {
        console.error('Error adding to analytics:', error);
        Alert.alert("Error", "Failed to add items to analytics.");
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Anna!</Text>
        <Text style={styles.location}>Panunggangan Timur, Tangerang</Text>
      </View>
      <View style={styles.analytics}>
        <Text style={styles.analyticsTitle}>Analytics</Text>
        <View style={styles.analyticsContent}>
          <Text style={styles.placeholderText}>No Data Available</Text>
        </View>
      </View>
      <View style={styles.ad}>
        <Text style={styles.adText}>DI SINI ADA IKLAN</Text>
      </View>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Lists</Text>
        <ScrollView style={styles.list}>
        {Array.isArray(foodItems) && foodItems.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <TouchableOpacity onPress={() => handleToggleCheck(index)}>
                <Icon 
                  name={item.checked ? "check-circle" : "circle"} 
                  size={30} 
                  color="#00806C" 
                  style={styles.icon1} 
                />
              </TouchableOpacity>
              <Text style={[styles.itemName, item.checked && styles.strikethrough]}>
                {item.groceryName}
              </Text>
              <Text style={[styles.itemDetails, item.checked && styles.strikethrough]}>
                {item.weight} | Rp{item.groceryPrice.toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
          <View style={styles.garisbawah}></View>
          <View style={styles.containertotal}>
            <Text style={styles.grandtotal}>Grand total :</Text>
            <Text style={styles.hargatotal}>Rp{grandTotal.toLocaleString('id-ID')},-</Text>
          </View>
        </ScrollView>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#F6E9BE',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F6E9BE',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000'
  },
  location: {
    fontSize: 16,
    color: '#000000',
  },
  analytics: {
    padding: 20,
  },
  analyticsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000'
  },
  analyticsContent: {
    width: screenWidth - 40,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginTop: 10,
  },
  placeholderText: {
    fontSize: 18,
    color: '#000000',
  },
  ad: {
    height: 72,
    width: 360,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginLeft: 20
  },
  adText: {
    fontSize: 20,
    color: '#000000',
  },
  listContainer: {
    padding: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    maxHeight: 300,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  itemName: {
    flex: 1,
    fontSize: 18,
    color: '#000000',
    marginLeft: 15,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#808080',
  },
  itemDetails: {
    fontSize: 14,
    color: '#888',
    marginRight: 25,
  },
  garisbawah: {
    height: 13,
    width: 319,
    backgroundColor: '#F6E9BE',
    marginTop: 10,
    borderRadius: 10,
  },
  containertotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  grandtotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  hargatotal: {
    fontSize: 20,
    color: '#000000',
  },
  containerbutton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  buttonadd: {
    height: 65,
    width: 258,
    borderRadius: 10,
    backgroundColor: '#00806C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tulisanadd: {
    fontSize: 25,
    color: '#F6E9BE',
  },
  icon1: {
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 5,
  },
});

export default HomeScreen;