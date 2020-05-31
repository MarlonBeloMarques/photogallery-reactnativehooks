import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import PHOTOS from "./src/data";

function Item ({ item }) {
  return (
    <Image 
      source={{ uri: item.url }} 
      style={{ width: 200, height: 200 }} 
    />
  )
} 

export default function App() {
  return (
    <ScrollView style={styles.container}>
      {PHOTOS.map((photo) => (
        <Item key={photo.id} item={photo} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
