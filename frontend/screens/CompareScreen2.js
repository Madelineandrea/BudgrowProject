import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BUDGROW_PLACES_API_KEY } from './config';

//Kode untuk menampilkan supermarket sekitar lokasi user tetapi belom bekerja sepenuhnya
// const getNearbyMarkets = async (latitude, longitude) => {
//   try {
//     const radius = 1000;
//     const types = [
//       'grocery_or_supermarket',
//       'food',
//       'store',
//       'supermarket',
//       'minimarket',
//       'fruit_store',
//       'clothing_store',
//       'department_store',
//       'electronics_store',
//       'book_store',
//       'convenience_store',
//       'department_store'
//     ];
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&types=${types.join(
//         '|'
//       )}&key=${BUDGROW_PLACES_API_KEY}`
//     );
//     let nearbyMarkets = response.data.results;
//     nearbyMarkets = nearbyMarkets.filter(market => {
//       const name = market.name.toLowerCase();
//       return (
//         name.indexOf('alfamart') !== -1 ||
//         name.indexOf('indomaret') !== -1 ||
//         name.indexOf('pasar 8') !== -1 ||
//         name.indexOf('aeon store') !== -1 ||
//         name.indexOf('total buah') !== -1 ||
//         name.indexOf('duta buah') !== -1 ||
//         name.indexOf('ranch market living world') !== -1 
//       );
//     });
//     return nearbyMarkets;
//   } catch (error) {
//     console.error('Error fetching nearby markets:', error);
//     return [];
//   }
// };

 const CompareScreen2 = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { groceryName } = route.params;

  const [nearbyMarkets, setNearbyMarkets] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const [groceryData, setGroceryData] = useState([]);
  const [storeData, setStoreData] = useState([]);

  const handleAddToList = () => {
    Alert.alert(
      "Add to list",
      "Are you sure?",
      [
        {
          text: "No",
          onPress: () => console.log("No pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => console.log("Yes pressed") }
      ],
      { cancelable: false }
    );
  };

  const latitude = -6.22386;
  const longitude = 106.64918;
  const searchKey = '';

  useEffect(() => {
    fetchProductData();
    fetchNearbyMarkets(latitude, longitude);
  }, []);

  const fetchProductData = async () => {
    try {
      const groceryResponse = await axios.get(`http://192.168.1.53:3002/search/groceries?q=${searchKey}`);
      const storeResponse = await axios.get(`http://192.168.1.53:3002/search/stores?q=${searchKey}`);
      
      console.log('Grocery Data:', groceryResponse.data);
      console.log('Store Data:', storeResponse.data);
      
      setGroceryData(Array.isArray(groceryResponse.data) ? groceryResponse.data : []);
      setStoreData(Array.isArray(storeResponse.data) ? storeResponse.data : []);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setGroceryData([]);
      setStoreData([]);
    }
  };

  const fetchNearbyMarkets = async (lat, long) => {
    const markets = await getNearbyMarkets(lat, long);
    setNearbyMarkets(markets);
  };

  const supermarkets = [
    'Supermarket Segar',
    'Hypermart',
    'Carrefour',
    'Lottemart',
    'Giant'
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.titleContainer, subStyles.content]}>
          <Text style={styles.title}>Price Comparison</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.productInfo}>
          <View style={[styles.imageWrapper, { flex: 5 }]}>
            {groceryData.length > 0 && groceryData[0].imageURL && (
              <Image
                source={{ uri: groceryData[0].imageURL }}
                style={styles.image}
                resizeMode="contain"
                onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
              />
            )}
          </View>
          <View style={styles.productDetails}>
            <View style={styles.productBackground} />
            <View style={styles.productBackgroundLight} />
            <View style={styles.productHeader}>
              <View style={styles.productNameWrapper}>
                <Text style={styles.productText}>{groceryData.length > 0 ? groceryData[0].groceryName : 'Product Name'}</Text>
              </View>
              <View style={styles.productWeightWrapper}>
                <Text style={styles.productText}>⚖️ </Text>
                <Text style={styles.productText}>{groceryData.length > 0 ? groceryData[0].weight : 'Weight'}</Text>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.brandPriceInfo}>
              <View style={styles.brandInfo}>
                <Text style={styles.productText}>Brand:</Text>
                <Text style={[styles.productText, styles.brandName]}>{groceryData.length > 0 ? groceryData[0].brand : 'Brand Name'}</Text>
              </View>
              <View style={styles.price}>
                <Text style={styles.productText}>My best price</Text>
                <Text style={styles.priceText}>{groceryData.length > 0 ? `Rp${groceryData[0].groceryPrice.toLocaleString('id-ID')},00` : 'Price'}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.extraInfo, { flex: 7, position: 'relative', paddingBottom: 10, borderWidth: 0 }]}>
            <View style={[styles.View, { marginTop: 10, marginBottom: 10, width: '95%', paddingHorizontal: 10, borderWidth: 1, borderColor: 'black' }]}>
              <Text style={[styles.modalTitle, { fontSize: 20, textAlign: 'left' }]}>Supermarkets</Text>
              <View style={styles.supermarketContainer}>
                {supermarkets.map((supermarket, index) => (
                  <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={[styles.supermarketText, { flex: 1, textAlign: 'left' }]}>{supermarket}</Text>
                    <Text style={[styles.storePrice, { flex: 1, textAlign: 'right' }]}>
                      {storeData.length > index ? `Rp${storeData[index].storePrice.toLocaleString('id-ID')},00` : 'Price not available'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddToList}>
            <Text style={styles.addButtonText}>Add to List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const subStyles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F6E9BE',
  },
  titleContainer: {
    flex: 7,
    backgroundColor: '#F6E9BE',
  },
  imageContainer: {
    flex: 7,
  },
  productInfo: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, width: undefined,
  },
  productDetails: {
    flex: 4, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6D9',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 20,
    marginHorizontal: 20,
    position: 'relative',
    marginBottom: 50,
  
  },
  productBackground: {
    position: 'absolute',
    backgroundColor: '#EFC645',
    top: -10,
    right: -10,
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderRadius: 20,
    zIndex: -1,
  },
  productBackgroundLight: {
    position: 'absolute',
    backgroundColor: '#FFF6D9',
    top: -1,
    right: -1,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 0,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF6D9',
    borderRadius: 20,
    top: -4,
  },
  productNameWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6D9',
    borderRadius: 20,
  },
  productWeightWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6D9',
    borderRadius: 20,
  },
  brandPriceInfo: {
    flexDirection: 'column',
    marginTop: 0,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    left: -20,
    
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },  
  brandName: {
    color: 'black',
    right: -100,
  }, 
  gridContainer: {
    flexDirection: 'column',
  },  
  separator: {
    borderBottomWidth: 5,
    borderTopWidth: 5,
    borderBottomColor: '#F6E9BE',
    borderTopColor: '#F6E9BE',
    width: '100%',
    marginVertical: 5,
  },
  extraInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  liveLocationButton: {
    backgroundColor: '#00806C',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  liveLocationButtonText: {
    fontSize: 20,
    color: '#F6E9BE',
    textAlign: 'center',
  },  
  footerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketItem: {
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  marketName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  marketAddress: {
    fontSize: 14,
    color: '#555',
  },
  marketPrice: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00806C',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 28,
    color: '#F6E9BE',
  },
  arrow: {
    fontSize: 50,
    color: 'black',
    top: -10,
    fontWeight: 'bold',
  },
  title: {
    fontFamily: 'Spinnaker-Regular',
    fontSize: 28,
    color: 'black',
    textAlign: 'left',
  },
  productText: {
    fontSize: 15,
    color: 'black',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  priceText: {
    fontSize: 18,
    color: 'black',
    right: -40,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    left: -20,
  },
  brandPriceItem: {
    marginRight: 'auto',
  },
  priceItem: {
    marginLeft: 'auto',
  },  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#00806C',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#F6E9BE',
    textAlign: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#F6E9BE',
    marginRight: 5,
  },
  supermarketContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
  supermarketText: {
    fontSize: 16,
    marginBottom: 5,
  },
  storePrice: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
});

export default CompareScreen2;