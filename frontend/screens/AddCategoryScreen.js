import React, {useState, useEffect} from 'react';
import { Pressable, View, Text, Modal, TextInput, StyleSheet, FlatList, Dimensions, SafeAreaView , ActivityIndicator, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const AddCategoryScreen = ({navigation}) => {
  const { width } = Dimensions.get('window');
  const itemSize = width / 2 - 20;

  const [modalVisible, setModalVisible] = useState(false); 
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://192.168.1.53:3002/category'); 
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://192.168.1.53:3002/category', 
      {
        name: categoryName
      });
      console.log(response.data.message);
      Alert.alert('Success', 'Category added successfully');
      setCategories([...categories, { name: categoryName}]); 
      setModalVisible(false); 
    } catch (error) {
      console.error('Error adding category:', error.response.data);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={[styles.categories, {width: itemSize, height: itemSize}]}
      
      onPress={() => {
        console.log('Navigating to food items with category:', item.categoryName);
        navigation.navigate('Choose Type', {categoryName: item.categoryName})
      }}
    >
      <Icon name="folder" size={40} color="#000" style={styles.icon} />
      <Text style={styles.catName}>{item.categoryName}</Text>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data = {categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.categoryName}
          contentContainerStyle={styles.list}
          numColumns={2}
          />

        <Pressable style={styles.fab} onPress={() => setModalVisible(true)}>
            <Icon name="plus" size={24} color="#fff" />
        </Pressable>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              onChangeText={text => setCategoryName(text)}
            />
          <Pressable style={styles.addButton} onPress={handleAddCategory}>
            <Text style={styles.addButtonText}>Add Category</Text>
          </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {  
    flex: 1,
  },
  scrollViewContent: {  
    flexGrow: 1,
  },
  header:{
    fontSize: 24,
    margin: 20
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#F6E9BE',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 30,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  item:{
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 5
  },
  itemImage:{
    height: 80,
    width: 80
  },
  icon: {
    color: '#383A49'
},
  catName:{
    fontSize:20
  },
  categories: {
    fontSize: 20,
    backgroundColor: '#D1E1C5' ,
    color: "#383A49",
    margin: 10,
    padding: 10,
    borderRadius: 30,
    height: 132,
    width: 132,
    marginTop: 20,
    textAlign: 'top',
    textAlignVertical: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ScrollView:{
    paddingVertical: 20
  }
});

export default AddCategoryScreen;
