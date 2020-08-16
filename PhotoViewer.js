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
const maxHeight = Dimensions.get("window").height;

function DetailView (props) {

  const { photo, onClose, sourcePhotoDimensions } = props;

  const [openProgress, setOpenProgress] = useState(new Animated.Value(0))
  const [openMeasurements, setOpenMeasurements] = useState(null)

  const [animationComplete, setAnimationComplete] = useState(false);

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

  let openingInitScale = 0;
  let openingInitTranslateY = 0;
  let openingInitTranslateX = 0;


  if (openMeasurements) {
    const aspectRatio = photo.width / photo.height;
    const screenAspectRatio = maxWidth / 300;

    if (aspectRatio - screenAspectRatio > 0) {
      const maxDim = openMeasurements.destWidth;
      const srcShortDim = openMeasurements.sourceHeight;
      const srcMaxDim = srcShortDim * aspectRatio;
      openingInitScale = srcMaxDim / maxDim;
    } else {
      const maxDim = openMeasurements.destHeight;
      const srcShortDim = openMeasurements.sourceWidth;
      const srcMaxDim = srcShortDim / aspectRatio;
      openingInitScale = srcMaxDim / maxDim;
    }
  }

  if (openMeasurements) {
    const translateInitY =
      openMeasurements.sourceY + openMeasurements.sourceHeight / 2;
    const translateDestY =
      openMeasurements.destY + openMeasurements.destHeight / 2;
    openingInitTranslateY = translateInitY - translateDestY;
    const translateInitX =
      openMeasurements.sourceX + openMeasurements.sourceWidth / 2;
    const translateDestX =
      openMeasurements.destX + openMeasurements.destWidth / 2;
    openingInitTranslateX = translateInitX - translateDestX;
  }

  console.log(openingInitTranslateY);

  useEffect(() => {
    Animated.timing(openProgress, {
      toValue: 1,
      duration: 300
    }).start(() => {
      setAnimationComplete(true);
    })

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
            inputRange: [0, 0.99, 0.995],
            outputRange: [0, 0, 1],
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

      {openMeasurements && !animationComplete && (
        <Animated.Image
          source={{ uri: photo.url }}
          style={{
            position: "absolute",
            width: openMeasurements.destWidth,
            height: openMeasurements.destHeight,
            left: openMeasurements.destX,
            top: openMeasurements.destY,
            opacity: openProgress.interpolate({
              inputRange: [0,  0.005, 0.995, 1],
              outputRange: [0, 1, 1, 0]
            }),
            transform: [
                {
                  translateX: openProgress.interpolate({
                    inputRange: [0.01, 0.99],
                    outputRange: [openingInitTranslateX, 0]
                  })
                },
                {
                  translateY: openProgress.interpolate({
                    inputRange: [0.01, 0.99],
                    outputRange: [openingInitTranslateY, 0]
                  })
                },
                {
                  scale: openProgress.interpolate({
                    inputRange: [0.01, 0.99],
                    outputRange: [openingInitScale, 1]
                  })
                }
              ]
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
