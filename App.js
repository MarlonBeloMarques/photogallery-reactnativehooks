import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import PHOTOS from "./src/data";
import { processImages, buildRows, normalizeRows } from "./src/utils";

const maxWidth = Dimensions.get("window").width;


function Item ({ item }) {
  return (
    <Image
      source={{ uri: item.url }}
      style={{
        width: item.width,
        height: item.height
      }}
    />
  )
} 

export default function App() {

  const [dataSource, setDataSource] = useState()

  useEffect(() => {
    const processedImages = processImages(PHOTOS)
    let rows = buildRows(processedImages, maxWidth)
    rows = normalizeRows(rows, maxWidth)

    setDataSource(rows)

  }, [])

  function renderItem({ item, index }) {
    return(
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 5,
          justifyContent: 'space-between'
        }}>
          {item.map(item => <Item item={item} key={item.id} />)}
      </View>
    )
  }

  return (
    <FlatList data={dataSource} renderItem={renderItem} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
