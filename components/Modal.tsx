import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import EntypeIconsButton from "./EntypeIconsButton";

interface CustomActionSheetProps {
  slideAnim: any;
  showActionSheet: () => void;
  hideActionSheet: () => void;
  hideModal: () => void;
  pictureTakenHandler: (mode: string, uri: string) => void;
  isVisible: boolean;
  onCameraHandler: () => void;
}

const CustomActionSheet = ({
  slideAnim,
  isVisible,
  showActionSheet,
  hideActionSheet,
  hideModal,
  pictureTakenHandler,
  onCameraHandler,
}: CustomActionSheetProps) => {
  // const [isVisible, setIsVisible] = useState(false);

  // 액션 시트를 표시하는 함수
  // const showActionSheet = () => {
  //   setIsVisible(true);
  //   Animated.timing(slideAnim, {
  //     toValue: 1,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // // 액션 시트를 숨기는 함수
  // const hideActionSheet = () => {
  //   Animated.timing(slideAnim, {
  //     toValue: 0,
  //     duration: 300,
  //     useNativeDriver: true,
  //   }).start(() => {
  //     setIsVisible(false);
  //   });
  // };

  // 애니메이션된 뷰의 스타일
  const slideUpStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [200, 0], // 액션 시트가 이동할 범위
        }),
      },
    ],
  };

  const uploadImage = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        // 사용자가 선택을 취소하지 않았고, assets 배열이 존재하는지 확인
        const asset = result.assets[0];
        pictureTakenHandler("gallery", asset.uri);
        hideActionSheet();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const transparent = "rgba(0, 0, 0, 0.5)";
  function renderModal() {
    return (
      <Modal transparent={true} visible={isVisible} animationType="slide">
        <TouchableWithoutFeedback onPress={hideActionSheet}>
          <View
            style={{
              opacity: 0.5,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: transparent,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                width: "90%",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  console.log("touch");
                }}
              >
                <EntypeIconsButton
                  // title={"확인"}
                  icon="camera"
                  onPress={() => {
                    // pictureTakenHandler(currentIndex);
                    // hideModal();
                    onCameraHandler();
                  }}
                />

                <EntypeIconsButton
                  // title={"확인"}
                  icon="image"
                  onPress={() => {
                    uploadImage();
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  return (
    <TouchableOpacity
      onPress={hideActionSheet}
      style={{
        opacity: 0.5,
        backgroundColor: "black",
      }}
    >
      {renderModal()}
    </TouchableOpacity>
    // <View style={{ flex: 1 }}>
    //   <Modal transparent visible={isVisible} animationType="none">
    //     <TouchableWithoutFeedback
    //       onPress={hideActionSheet}
    //       style={{
    //         opacity: 0.5,
    //         backgroundColor: "black",
    //       }}
    //     >
    //       <View
    //         style={{
    //           flex: 1,
    //           opacity: 0.5,
    //           justifyContent: "flex-end",
    //           backgroundColor: "black",
    //         }}
    //       >
    //         <Animated.View
    //           style={[
    //             { width: "100%", height: 200, backgroundColor: "white" },
    //             slideUpStyle,
    //           ]}
    //         >
    //           {/* 액션 시트의 내용 */}

    //           <EntypeIconsButton
    //             // title={"확인"}
    //             icon="camera"
    //             onPress={() => {
    //               hideModal();
    //             }}
    //           />

    //           <EntypeIconsButton
    //             // title={"확인"}
    //             icon="image"
    //             onPress={() => {
    //               uploadImage();
    //             }}
    //           />
    //           <Text>Your content here</Text>
    //         </Animated.View>
    //       </View>
    //     </TouchableWithoutFeedback>
    //   </Modal>
    // </View>
  );
};

export default CustomActionSheet;
