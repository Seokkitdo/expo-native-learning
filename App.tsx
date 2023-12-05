import { Alert, Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as Location from "expo-location";
import MediaLibrary from "expo-media-library";

import ImagePreview from "./components/ImagePreview";
import CustomCamera from "./components/CustomCamera";
import Button from "./components/Button";

export default function App() {
  const [images, setImages] = React.useState([null, null, null, null]);
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<any>(null);
  const [cameraType, setCameraType] = React.useState(CameraType.back);
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off);

  const cameraRef = React.useRef<Camera>(null);

  const __startCamera = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    console.log({ status });

    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const onCameraHandler = () => {
    __startCamera();
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar style="auto" /> */}

      {startCamera ? (
        <CustomCamera cameraRef={cameraRef} onCameraHandler={onCameraHandler} />
      ) : (
        <View style={styles.imagePickerContainer}>
          {images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              onCameraHandler={onCameraHandler}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingBottom: 20,
  },
  imagePickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
});
