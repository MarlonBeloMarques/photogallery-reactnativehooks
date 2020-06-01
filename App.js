import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import PHOTOS from "./src/data";
import { processImages, buildRows, normalizeRows } from "./src/utils";
import PhotoViewer from "./PhotoViewer";

const maxWidth = Dimensions.get("window").width;


function Item ({ item, onPhotoOpen, dimensionPhotoClicked }) {

  const [dimensions, setDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });


  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPhotoOpen(item), dimensionPhotoClicked(dimensions);
      }}
    >
      <Image
        onLayout={(event) => {
          const { x, y, height, width } = event.nativeEvent.layout;
          setDimensions({ x: x, y: y, height: height, width: width });
        }}
        source={{ uri : item.url }}
        style={{
          width: item.width,
          height: item.height,
        }}
      />
    </TouchableWithoutFeedback>
  );
} 

export default function App() {

  const [dataSource, setDataSource] = useState()

  useEffect(() => {
    const processedImages = processImages(PHOTOS)
    let rows = buildRows(processedImages, maxWidth)
    rows = normalizeRows(rows, maxWidth)

    setDataSource(rows)

  }, [])

  return (
    <PhotoViewer
      renderContent={({ onPhotoOpen, dimensionPhotoClicked }) =>
        <FlatList 
          data={dataSource} 
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5,
                justifyContent: "space-between",
              }}
            >
              {item.map((item) => (
                <Item item={item} key={item.id} onPhotoOpen={onPhotoOpen} dimensionPhotoClicked={dimensionPhotoClicked} />
              ))}
            </View>
          )} 
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
