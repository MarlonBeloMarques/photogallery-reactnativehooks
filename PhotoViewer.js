import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated
} from "react-native";

const maxWidth = Dimensions.get("window").width;

function DetailView (props) {

  const { photo, onClose, sourcePhotoDimensions } = props;

  const [openProgress, setOpenProgress] = useState(new Animated.Value(0))
  const [openMeasurements, setOpenMeasurements] = useState(null)

  const [sourcePhoto, setSourcePhoto] = useState({
    x: sourcePhotoDimensions.x,
    y: sourcePhotoDimensions.y,
    width: sourcePhotoDimensions.width,
    height: sourcePhotoDimensions.height,
  });

  const elementRef = useRef()

  const [destinePhoto, setDestinePhoto] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    Animated.timing(openProgress, {
      toValue: 1,
      duration: 300
    }).start()

    setOpenMeasurements({
      sourceX: sourcePhoto.x,
      sourceY: sourcePhoto.y,
      sourceWidth: sourcePhoto.width,
      sourceHeight: sourcePhoto.height,
      destX: 0,
      destY: 0,
      destWidth: maxWidth,
      destHeight: 300,
    });

  }, []) 

  return (
    <View style={[StyleSheet.absoluteFill, {}]}>
      <Animated.Image
        source={{ uri: photo.url }}
        style={{
          width: maxWidth,
          height: 300,
          opacity: openProgress.interpolate({
            inputRange: [0.8, 1],
            outputRange: [0, 1],
          }),
        }}
      />
      <Animated.View
        style={[
          styles.body,
          {
            opacity: openProgress,
            backgroundColor: '#fff',
            transform: [
              {
                translateY: openProgress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>- {photo.postedBy}</Text>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Text>
      </Animated.View>

      {openMeasurements && (
        <Animated.Image
          source={{ uri: photo.url }}
          style={{
            position: "absolute",
            width: openProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [
                openMeasurements.sourceWidth,
                openMeasurements.destWidth,
              ],
            }),
            height: openProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [
                openMeasurements.sourceHeight,
                openMeasurements.destHeight,
              ],
            }),
            left: openProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [openMeasurements.sourceX, openMeasurements.destX],
            }),
            top: openProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [openMeasurements.sourceY, openMeasurements.destY],
            }),
          }}
        />
      )}

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PhotoViewer (props) {
  
  const [photo, setPhoto] = useState(null)
  const [dimensions, setDimensions] = useState({})

  function sourcePhoto(dimensions) {
    setDimensions(dimensions)
  }

  function open(photo) {
    console.log(photo);
    setPhoto(photo)
  }

  function close() {
    setPhoto(null)
  }

  return (
    <View style={{ flex: 1 }}>
      {props.renderContent({ onPhotoOpen: open, dimensionPhotoClicked: sourcePhoto })}
      {photo && <DetailView photo={photo} onClose={close} sourcePhotoDimensions={dimensions}/>}
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    color: "#000",
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "Avenir Next",
    lineHeight: 50,
  },
  description: {
    color: "#333",
    fontSize: 14,
    fontFamily: "Avenir Next",
  },
  body: { flex: 1, padding: 15 },
  closeText: { color: "white", backgroundColor: "transparent" },
  closeButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    top: 20,
    left: 20,
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "white",
    borderRadius: 5,
  },
  detailView: {
    backgroundColor: "#fff",
  },
});
