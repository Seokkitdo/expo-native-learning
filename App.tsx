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

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        console.log(cameraRef.current);

        const data = await cameraRef.current.takePictureAsync();

        console.log("uri", data.uri);

        setCapturedImage(data.uri);
      } catch (error) {
        console.log("Error taking picture", error);
      }
    }
  };

  const saveImage = async () => {
    if (capturedImage) {
      try {
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
      {/* <StatusBar style="auto" /> */}

      {startCamera ? (
        <CustomCamera cameraRef={cameraRef} onCameraHandler={onCameraHandler} />
      ) : (
        // <View style={styles.cameraContainer}>
        //   {!capturedImage ? (
        //     <Camera
        //       style={styles.camera}
        //       type={cameraType}
        //       flashMode={flashMode}
        //       ref={cameraRef}
        //     >
        //       <View
        //         style={{
        //           flexDirection: "row",
        //           justifyContent: "space-between",
        //           padding: 30,
        //         }}
        //       >
        //         <Button
        //           icon={"retweet"}
        //           title="type"
        //           onPress={() => {
        //             setCameraType(
        //               cameraType === CameraType.back
        //                 ? CameraType.front
        //                 : CameraType.back
        //             );
        //           }}
        //         />
        //         <Button
        //           color={flashMode === FlashMode.off ? "gray" : "#f1f1f1"}
        //           icon={"flash"}
        //           title="flash"
        //           onPress={() => {
        //             setFlashMode(
        //               flashMode === FlashMode.off ? FlashMode.on : FlashMode.off
        //             );
        //           }}
        //         />
        //       </View>
        //     </Camera>
        //   ) : (
        //     <Image source={{ uri: capturedImage }} style={styles.camera} />
        //   )}

        //   <View>
        //     {capturedImage ? (
        //       <View
        //         style={{
        //           flexDirection: "row",
        //           justifyContent: "space-between",
        //           paddingHorizontal: 50,
        //         }}
        //       >
        //         <Button
        //           title={"Re-take"}
        //           icon="retweet"
        //           onPress={() => setCapturedImage(null)}
        //         />
        //         <Button title={"save"} icon="check" onPress={saveImage} />
        //       </View>
        //     ) : (
        //       <Button
        //         title="Take Picture"
        //         onPress={takePicture}
        //         icon="camera"
        //         color="#f1f1f1"
        //       />
        //     )}
        //   </View>
        // </View>
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
