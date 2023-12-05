import { Camera, CameraType, FlashMode } from "expo-camera";
import React, { useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
} from "react-native";
import Button from "./Button";
import * as MediaLibrary from "expo-media-library";

interface CustomCameraProps {
  cameraRef: any;
  onCameraHandler: () => void;
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
    case "16:9":
      // 16:9 비율의 경우, 높이는 가로의 16/9입니다.
      height = windowWidth * (16 / 9);
      break;
    default:
      // 기본값으로 높이를 가로의 16/9 비율로 설정합니다.
      height = windowWidth * (16 / 9);
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

function CustomCamera({ cameraRef, onCameraHandler }: CustomCameraProps) {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<any>(null);
  const [cameraType, setCameraType] = React.useState(CameraType.back);
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off);
  const [ratio, setRatio] = React.useState("4:3");

  console.log(calculateCameraStyle(ratio));

  function toggleCameraType() {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const ratio = await cameraRef.current.getSupportedRatiosAsync();
      console.log({ ratio });

      try {
        const data = await cameraRef.current.takePictureAsync();

        setCapturedImage(data.uri);
      } catch (error) {
        console.log("Error taking picture", error);
      }
    }
  };

  const saveImage = async () => {
    if (capturedImage) {
      try {
        await MediaLibrary.requestPermissionsAsync();
        await MediaLibrary.saveToLibraryAsync(capturedImage);
        alert("Image saved to library");
        setCapturedImage(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <Camera
          style={[styles.camera, calculateCameraStyle(ratio)]}
          type={cameraType}
          flashMode={flashMode}
          ref={cameraRef}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 30,
            }}
          >
            <Button
              icon={"retweet"}
              title="type"
              onPress={() => {
                setCameraType(
                  cameraType === CameraType.back
                    ? CameraType.front
                    : CameraType.back
                );
              }}
            />
            <Button
              color={flashMode === FlashMode.off ? "gray" : "#f1f1f1"}
              icon={"flash"}
              title="flash"
              onPress={() => {
                setFlashMode(
                  flashMode === FlashMode.off ? FlashMode.on : FlashMode.off
                );
              }}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: capturedImage }} style={styles.camera} />
      )}

      <View>
        {capturedImage ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 50,
            }}
          >
            <Button
              title={"Re-take"}
              icon="retweet"
              onPress={() => setCapturedImage(null)}
            />
            <Button title={"save"} icon="check" onPress={saveImage} />
          </View>
        ) : (
          <View style={styles.pictureBtnContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.pictureBtn}
            ></TouchableOpacity>
          </View>
          // <Button
          //   title="Take Picture"
          //   onPress={takePicture}
          //   icon="camera"
          //   color="#f1f1f1"
          // />
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
    paddingBottom: 20,
  },
  camera: {
    borderRadius: 20,
  },
  pictureBtnContainer: {
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
    marginBottom: 25,
  },
});

export default CustomCamera;
