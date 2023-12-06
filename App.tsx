import {
  Alert,
  Image,
  StyleSheet,
  View,
  Animated,
  SafeAreaView,
} from "react-native";
import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

import ImagePreview from "./components/ImagePreview";
import CustomCamera from "./components/CustomCamera";
import CustomActionSheet from "./components/Modal";

export default function App() {
  const [images, setImages] = React.useState([null, null, null, null]);
  const [startCamera, setStartCamera] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  const cameraRef = React.useRef<Camera>(null);
  const slideAnim = useRef(new Animated.Value(0)).current; // 액션 시트의 시작 위치

  const __startCamera = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const onPreviewImgHandler = (idx: number) => {
    // __startCamera();
    setCurrentIndex(idx);

    showActionSheet();
  };

  const onCameraHandler = () => {
    console.log("start camera");

    __startCamera();
    hideActionSheet();
  };

  const showActionSheet = () => {
    setIsVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideActionSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      // hideActionSheet();
      setIsVisible(false);
    });

    setStartCamera(false);
    setCurrentIndex(null);
  };

  const pictureTakenHandler = async (mode: string, newImage: any) => {
    setImages((prevImages) => {
      if (currentIndex == null) return prevImages;
      const updatedImages = [...prevImages];
      updatedImages[currentIndex] = newImage; // currentIndex는 현재 수정하려는 이미지의 인덱스
      return updatedImages;
    });

    if (mode === "camera") {
      setStartCamera(false);
      setCurrentIndex(null);
    } else if (mode === "gallery") {
      hideActionSheet();
      setCurrentIndex(null);
    }
  };

  const hideModal = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {startCamera ? (
        <SafeAreaView style={styles.safeArea}>
          <CustomCamera
            cameraRef={cameraRef}
            uploadPhoto={pictureTakenHandler}
          />
        </SafeAreaView>
      ) : (
        <View>
          {/* <CustomCamera
            cameraRef={cameraRef}
            uploadPhoto={pictureTakenHandler}
          /> */}
          <View style={styles.imagePickerContainer}>
            {images.map((image, index) => (
              <ImagePreview
                key={index}
                image={image}
                onPreviewImgHandler={() => onPreviewImgHandler(index)}
              />
            ))}
          </View>
          <CustomActionSheet
            slideAnim={slideAnim}
            isVisible={isVisible}
            showActionSheet={showActionSheet}
            hideActionSheet={hideActionSheet}
            pictureTakenHandler={pictureTakenHandler}
            hideModal={hideModal}
            onCameraHandler={onCameraHandler}
          />
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
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
});
