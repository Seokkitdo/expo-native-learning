import { Camera, CameraType, FlashMode } from "expo-camera";
import React, { useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
} from "react-native";
import Button from "./Button";
import * as MediaLibrary from "expo-media-library";

interface CustomCameraProps {
  cameraRef: any;
  onCameraHandler: () => void;
}

function CustomCamera({ cameraRef, onCameraHandler }: CustomCameraProps) {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<any>(null);
  const [cameraType, setCameraType] = React.useState(CameraType.back);
  const [flashMode, setFlashMode] = React.useState<FlashMode>(FlashMode.off);

  function toggleCameraType() {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
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
          style={styles.camera}
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
          <Button
            title="Take Picture"
            onPress={takePicture}
            icon="camera"
            color="#f1f1f1"
          />
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
    flex: 1,
    borderRadius: 20,
  },
});

export default CustomCamera;
