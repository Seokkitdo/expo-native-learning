import * as React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  icon: any;
  color?: string;
  styleProp?: any;
}

function EntypeIconsButton({ title, onPress, icon, color }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Entypo name={icon} size={28} color={color ? color : "#f1f1f1"} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export default EntypeIconsButton;

const styles = StyleSheet.create({
  button: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#f1f1f1",
    marginLeft: 10,
  },
});
