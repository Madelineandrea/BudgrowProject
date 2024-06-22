import React, {useState, useEffect} from 'react';
import Icons from 'react-native-vector-icons/FontAwesome';
import { FlatList, Pressable, View, Text, Modal, TextInput, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const AddTypeScreen = ({ route, navigation}) => {
  const{categoryName} = route.params;

  const [modalVisible, setModalVisible] = useState(false); 
  const [typeName, setTypeName] = useState('');
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('http://192.168.1.53:3002/type',
        {params: { category: categoryName }});
        const sortedTypes = response.data.sort((a, b) => a.groceryName.localeCompare(b.groceryName));
        setTypes(sortedTypes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching types:', error);
        setLoading(false);
      }
    };

    fetchTypes();
  }, [categoryName]);

//Ini kode untuk menambahkan jenis kategori baru yang belum bekerja
  // const handleAddType = () => {
  //   try {
  //     const response = await axios.post('http://192.168.1.2:3002/addtype', 
  //     {
  //       name: categoryName
  //     });
  //     console.log(response.data.message);
  //     Alert.alert('Success', 'Type added successfully');
  //     setTypes([...type, { name: typeName}]); 
  //     setModalVisible(false); 
  //   } catch (error) {
  //     console.error('Error adding type:', error.response.data);
  //     Alert.alert('Error', 'Failed to add type');
  //   }
  // };


  return (
    <SafeAreaView style={styles.container}>
       <FlatList
        data={types}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.cardmakanan]}
            onPress={() => navigation.navigate('Add/Edit Details', { foodType: item.groceryName })}
          >
            <Text style={styles.tulisanmakanan}>{item.groceryName}</Text>
            <Icons name="plus" size={20} color="#EFC645" style={styles.iconplus} />
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()} 
      />

          <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Type Name"
                  onChangeText={text => setTypeName(text)}
                />
              </View>
            </View>
          </Modal>
         
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBar: {
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBarText: {
    color: 'white',
    fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardmakanan: {
        backgroundColor: '#FFF6D9',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 340,
        height: 44,
        borderRadius: 20,
        marginTop: 15,
        marginLeft: 20,
        paddingHorizontal: 10,
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
  }

});

export default AddTypeScreen;
