import { Feather, Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";
import { StyleSheet } from "react-native";

export default function Navbar({ brand, navigation }) {
  return (
    <View style={styles.navbar}>
      {brand ? (
        <Text style={styles.brand}>ForgeScan</Text>
      ) : (
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 20 }}>
          <Feather name="arrow-left" size={24} color="black" />
        </Pressable>
      )}
      <Pressable style={{ opacity: 0 }}>
        <Ionicons name="menu-outline" size={32} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    display: "flex",
    alignItems: "flex-end",
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
});
