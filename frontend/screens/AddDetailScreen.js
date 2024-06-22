import React, { useState, useEffect } from 'react';
import { Dimensions, Button, TextInput, TouchableOpacity, View, Text, Image, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import { launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';
import axios from 'axios';
import { FontSize } from "../../GlobalStyles";

const AddDetailScreen = ({route, navigation}) => {
  const { foodType } = route.params;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [details, setDetails] = useState({
    imageURL: '',
    brand: '',
    weight: '',
    groceryPrice: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.53:3002/details?foodType=${foodType}`);
        if (response.data) {
          const data = response.data;
          setDetails({
            imageURL: data.imageURL || '',
            brand: data.brand || '',
            weight: data.weight || '',
            groceryPrice: data.groceryPrice ? data.groceryPrice.toString() : '',
            notes: data.notes || ''
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails(); 
  }, [foodType]);

  const handleInputChange = (field, value) => {
    setDetails(prevDetails => ({ ...prevDetails, [field]: value }));
  };

  const handleOpenCamera = () => {
    launchCamera({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.error('Camera Error:', response.error);
      } else {
        const newImage = { uri: response.assets[0].uri };
        setDetails(prevDetails => ({ ...prevDetails, image: newImage.uri }));
      }
    });
  };
  
  const handleViewPhotos = () => {
    navigation.navigate('ViewPhotos', { image }); //masih belom jadi ini
  };

  const handleSaveChanges = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://192.168.1.53:3002/details`, { ...details, foodType });
      } else {
        await axios.post(`http://192.168.1.53:3002/details`, { ...details, foodType });
      }
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes.');
    }
  };

  const handleAddToList = async () => {
    try {
      await axios.post('http://192.168.1.53:3002/grocery-list', {
        userID: 'Mady',
        groceryName: details.groceryName,
        weight: details.weight,
        groceryPrice: details.groceryPrice
      });
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error adding item to grocery list:', error);
      alert('Failed to add item to grocery list.');
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const { width } = Dimensions.get('window');

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.header}>{foodType}</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity 
          style={[styles.buttonCamera]} 
          onPress={handleOpenCamera}>
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        style={[styles.buttonCamera]} 
        onPress={handleViewPhotos}>
          <Text style={styles.buttonText}>View Photos</Text>
        </TouchableOpacity> 
      </View>

      {details.image ? (
      <Image source={{ uri: details.imageURL }} style={styles.image} />
    ) : null}

      <Text style={styles.details}>Brand</Text>
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={details.brand}
        onChangeText={(text) => handleInputChange('brand', text)}
      />

      <Text style={styles.details}>Weight</Text>
      <TextInput
      style={styles.input}
      placeholder="Weight"
      value={details.weight}
      onChangeText={(text) => handleInputChange('weight', text)}
    />

      <Text style={styles.details}>Price</Text>
      <TextInput
      style={styles.input}
      placeholder="Price"
      value={details.groceryPrice}
      onChangeText={(text) => handleInputChange('groceryPrice', text)}
    />

      <Text style={styles.details}>Additional Notes</Text>
      <TextInput
      style={styles.input}
      placeholder="Additional Notes"
      value={details.notes}
      onChangeText={(text) => handleInputChange('notes', text)}
      multiline
    />

        <Button title="Save Changes" onPress={handleSaveChanges} />
        <Button title="Add to List" onPress={handleAddToList} />

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>Food type has been successfully added to the grocery list.</Text>
          <Button
            title="View Grocery List"
            onPress={() => {
              handleModalClose();
              navigation.navigate('Lists');
            }}
          />
          <Button title="Continue" onPress={handleModalClose} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header:{
    fontSize: 20,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  details:{
    fontSize: 17,
    marginLeft: 20,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFF6D9',
    borderRadius: 15,
    backgroundColor: '#FFF6D9',
    padding: 10,
    marginBottom: 10,
    width: '90%',
    marginLeft: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
    backgroundColor: "#fff",
  },
  gridContainer: {
    flexDirection: 'row',
    marginTopBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10
    
  },
  buttonCamera: {
    backgroundColor: '#ccc', 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 135,
    width: 135,
    marginRight: 80
  },
  buttonText: {
    fontSize: 16,
  },
  saveChanges: {
    color: "#00806c",
    top: 792,
    fontSize: FontSize.size_xl,
    left: 35,
  },
  addToList:{
    left: 249,
    color: "#f6e9be",
    top: 792,
    fontSize: FontSize.size_xl,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    fontSize: 20,
    backgroundColor: '#00806C',
    color: "#383A49",
    margin: 10,
    padding: 10,
    height: 132,
    width: 132,
    textAlign: 'top',
    textAlignVertical: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerSelectStyles:{
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
    width: '100%',
  },
});

export default AddDetailScreen;
