import { Alert, Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

import ImagePreview from "./components/ImagePreview";
import CustomCamera from "./components/CustomCamera";

export default function App() {
  const [images, setImages] = React.useState([null, null, null, null]);
  const [startCamera, setStartCamera] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);

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

  const onCameraHandler = (idx: number) => {
    setCurrentIndex(idx);
    __startCamera();
  };

  const pictureTakenHandler = async (newImage: any) => {
    setImages((prevImages) => {
      // currentIndex가 null이거나 undefined이면 아무것도 안 함 (이미지를 수정하지 않음)
      if (currentIndex == null) return prevImages;
      const updatedImages = [...prevImages];
      updatedImages[currentIndex] = newImage; // currentIndex는 현재 수정하려는 이미지의 인덱스
      return updatedImages;
    });
    setStartCamera(false);
    setCurrentIndex(null); // 다음 업데이트를 위해 currentIndex를 리셋
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar style="auto" /> */}

      {startCamera ? (
        <CustomCamera cameraRef={cameraRef} uploadPhoto={pictureTakenHandler} />
      ) : (
        <View style={styles.imagePickerContainer}>
          {images.map((image, index) => (
            <ImagePreview
              key={index}
              image={image}
              onCameraHandler={() => onCameraHandler(index)}
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
