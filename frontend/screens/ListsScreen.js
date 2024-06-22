import React , {useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const ListsScreen = () => {
    const [foodItems, setFoodItems] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const [groceryList, setGroceryList] = useState([]);

    useEffect(() => {
        const getGroceryList = async () => {
            const data = await fetchGroceryList();
            setGroceryList(data);
          };
          getGroceryList();
        }, []);
    
        const fetchGroceryList = async () => {
            try {
                const response = await axios.get('http://192.168.1.53:3002/grocery-list');
                return response.data;
            } catch (error) {
                console.error('Error fetching grocery list:', error);
                return [];
            }
        };

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
    <SafeAreaView style={styles.container}>
    <ScrollView>
            <View>
                <View style={styles.headercard}>
                    <View style={styles.headerContent}>
                        <Text style={styles.headingText}>My Grocery List</Text>
                        <Icon name="cog" size={30} color="#00806C" style={styles.icon} />
                    </View>
                </View>

                <View style={styles.shadowContainer}>
                    <View style={styles.headercard2}></View>
                    <View style={styles.headercard3}>
                        <Text style={styles.tulisanlist}>List</Text>
                        <View style={styles.garis}></View>

                        <FlatList
                            data={groceryList}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <TouchableOpacity onPress={() => handleToggleCheck(item.index)}>
                                        <Icon
                                            name={item.checked ? "check-circle" : "circle"}
                                            size={30}
                                            color="#00806C"
                                            style={styles.icon1}
                                        />
                                </TouchableOpacity>
                                <Text style={[styles.listItem, item.checked && styles.strikethrough]}>
                                    {item.groceryName}
                                </Text>
                                <Text style={[styles.harga, item.checked && styles.strikethrough]}>
                                    {item.weight} | Rp{item.groceryPrice.toLocaleString('id-ID')}
                                </Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.groceryName}
                    />

                        <View style={styles.garisbawah}></View>
                        <View style={styles.containertotal}>
                            <Text style={styles.grandtotal}>Grand total :</Text>
                            <Text style={styles.hargatotal}>Rp{grandTotal.toLocaleString('id-ID')},-</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.containerbutton}>
                    <TouchableOpacity style={styles.buttonadd} onPress={handleAddToAnalytics}>
                        <Text style={styles.tulisanadd}>Add to Analytics</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

    </SafeAreaView>
  );
};

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
    marginLeft: 60,
},
icon1:{
    marginTop:10,
    marginLeft: 20,
    marginBottom:5,
},

shadowContainer: {
    position: 'relative',
    width: 319,
    height: 400,
    marginLeft: 25,
    marginTop: 30,
    right: 10,
    top: 10
},
headercard2: {
    bottom:10,
    left: 30,
    backgroundColor: '#EFC645',
    width: 319,
    height: 400,
    borderRadius: 10,
    zIndex: 1,

},
headercard3: {
    position: 'absolute',
    top: 5,
    left: 15,
    backgroundColor: '#FFF6D9',
    width: 319,
    height: 400,
    borderRadius: 10,
    zIndex: 2,
},
tulisanlist:{
    fontWeight: 'medium',
    fontSize:24,
    marginLeft: 15,
    marginTop:10,
    color: '#000000',

},
garis:{
    height: 13,
    width:319,
    backgroundColor: '#F6E9BE',
    marginTop: 5,
    borderRadius: 10,
},
itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
},
listItem: {
    flex: 1,
    fontSize: 20,
    color: '#000000',
    marginLeft: 15,
},

harga: {
    fontSize: 15,
    color: '#000000',
    marginRight:25,
},

garisbawah:{
    height: 13,
    width:319,
    backgroundColor: '#F6E9BE',
    marginTop: 145,
    borderRadius: 10,
},
containertotal:{
    marginLeft:15,
    marginTop:10,
    flexDirection: 'row'
},
grandtotal:{
    fontSize: 20,
    marginRight:75,
    fontWeight:'bold',
    color:'#000000'
    
},
hargatotal:{
    fontSize:20,
    fontWeight:'medium',
    color:'#000000'
},
containerbutton:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:35,
},
buttonadd:{
    height:65,
    width:258,
    borderRadius:10,
    backgroundColor:'#00806C',
    position:'relative',
    alignItems: 'left',
    
},
tulisanadd:{
    fontWeight:'medium',
    fontSize:22,
    color:'#F6E9BE',
    marginTop: 15,
    marginLeft:37,
  
},

});

export default ListsScreen;
