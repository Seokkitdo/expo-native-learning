import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

function IoniconsButton({ onPress, name, size, color }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

export default IoniconsButton;
