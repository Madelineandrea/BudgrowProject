import React from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const ViewPhotos = ({ route }) => {
  const { images } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.uri }}
          style={styles.image}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default ViewPhotos;
