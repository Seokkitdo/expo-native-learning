import { Camera, CameraType, FlashMode } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  useWindowDimensions,
} from "react-native";

import * as ScreenOrientation from "expo-screen-orientation";
import { DeviceMotion } from "expo-sensors";

import IoniconsButton from "./IonicButton";
import MaterialIconsButton from "./MaterialIconsButton";
import CameraPreview from "./CameraPreview";
import useDeviceOrientation from "../hooks/useDeviceOrientation";

interface CustomCameraProps {
  cameraRef: any;
  uploadPhoto: (mode: string, newImage: any) => void;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function calculateCameraStyle(ratio: string) {
  let height;

  switch (ratio) {
    case "4:3":
      // 4:3 비율의 경우, 높이는 가로의 4/3입니다.
      height = windowWidth * (4 / 3);
      break;
    case "3:4":
      // 4:3 비율의 경우, 높이는 가로의 4/3입니다.
      height = windowWidth * (3 / 4);
      break;
    case "16:9":
      // 16:9 비율의 경우, 높이는 가로의 16/9입니다.
      height = windowWidth * (16 / 9);
      break;
    default:
      // 기본값으로 높이를 가로의 16/9 비율로 설정합니다.
      height = windowWidth * (4 / 3);
  }

  // 높이가 화면을 넘어가지 않도록 합니다.
  if (height > windowHeight) {
    height = windowHeight;
  }

  return {
    width: windowWidth,
    height: height,
  };
}

function CustomCamera({ cameraRef, uploadPhoto }: CustomCameraProps) {
  const [capturedImage, setCapturedImage] = React.useState<any>(null);
  const [cameraType, setCameraType] = React.useState(CameraType.back);
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off);
  const [ratio, setRatio] = React.useState("4:3");

  // const { width, height } = useWindowDimensions();

  // useEffect(() => {
  //   console.log(width, height);
  // }, [width, height]);

  const orientation = useDeviceOrientation();

  console.log({ orientation });

  function toggleCameraType() {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const ratio = await cameraRef.current.getSupportedRatiosAsync();
      console.log("ratio", ratio);

      try {
        const data = await cameraRef.current.takePictureAsync();

        setCapturedImage(data.uri);
      } catch (error) {
        console.log("Error taking picture", error);
      }
    }
  };

  const uploadImage = () => {
    uploadPhoto("camera", capturedImage);
  };

  const setFlashModeHandler = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  return (
    <View style={styles.container}>
      {!capturedImage && (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "#000",
              alignItems: "center",
              paddingBottom: 12,
            }}
          >
            <IoniconsButton
              onPress={setFlashModeHandler}
              name={flashMode === FlashMode.off ? "ios-flash-off" : "ios-flash"}
              size={24}
              color="#fff"
            />
          </View>

          <Camera
            // style={{ flex: 1, width: "100%" }}
            style={[styles.camera, calculateCameraStyle(ratio)]}
            type={cameraType}
            ratio={ratio}
            flashMode={flashMode}
            ref={cameraRef}
          ></Camera>
        </View>
      )}

      <View style={{ flex: 1, width: "100%" }}>
        {capturedImage ? (
          <CameraPreview
            photo={capturedImage}
            retakePicture={retakePicture}
            savePhoto={uploadImage}
          />
        ) : (
          <View style={styles.pictureBtnContainer}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={takePicture} style={styles.pictureBtn} />
            <View style={{ flex: 1 }}>
              <View></View>
              <MaterialIconsButton
                style={{ alignItems: "center" }}
                color="#f1f1f1"
                size={40}
                onPress={toggleCameraType}
                icon="flip-camera-android"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 24,
  },
  camera: {
    borderRadius: 20,
  },
  pictureBtnContainer: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  pictureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#fff",
    justifyContent: "center", // 중앙에 위치시키기 위해 추가
    alignItems: "center", // 중앙에 위치시키기 위해 추가
  },
});

export default CustomCamera;
