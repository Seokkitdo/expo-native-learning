import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerProps {
  image: string | null;
  onCameraHandler: () => void;
}

const ImagePreview: React.FC<ImagePickerProps> = ({
  image,
  onCameraHandler,
}) => {
  // ... 이전에 작성된 로직 (handlePress 함수 등)

  const handlePress = async () => {
    onCameraHandler();
  };

  return (
    <TouchableOpacity style={styles.imagePicker} onPress={handlePress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text>Tap to take photo</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default ImagePreview;
