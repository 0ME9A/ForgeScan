import { Text, View, StyleSheet } from "react-native";

export default function AlertBox({ message, color }) {
  return (
    <View
      style={[styles.container, { backgroundColor: color ? color : "#FF4500" }]}
    >
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
  },
  message: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
  },
});
