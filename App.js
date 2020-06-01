import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
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

  const elementRef = useRef()
  const [dimensions, setDimensions] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onPhotoOpen(item), dimensionPhotoClicked(dimensions), console.log(dimensions)
      }}
    >
      <Image
        ref={elementRef}
        onLayout={(event) => {
          const { x, y, height, width } = event.nativeEvent.layout;
          setDimensions({ x: x, y: y, height: height, width: width });

          if(elementRef) {
            elementRef.current.measure((x, y, width, height, pageX, pageY) => {
                console.log(x, y, width, height, pageX, pageY);
            })
          }
        }}
        source={{ uri : item.url }}
        style={{
          width: item.width,
          height: item.height,
          borderWidth: 2
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
      renderContent={({ onPhotoOpen, dimensionPhotoClicked }) => (
        <FlatList
          data={dataSource}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 5,
                justifyContent: "space-between",
              }}
            >
              {item.map((item) => (
                <Item
                  item={item}
                  key={item.id}
                  onPhotoOpen={onPhotoOpen}
                  dimensionPhotoClicked={dimensionPhotoClicked}
                />
              ))}
            </View>
          )}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
});
