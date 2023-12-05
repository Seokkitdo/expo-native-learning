import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const MaterialIconsButton = ({ onPress, icon, size, color, style }: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <MaterialIcons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

export default MaterialIconsButton;
