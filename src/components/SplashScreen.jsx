import { StyleSheet, Text, View, Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text></Text>
      <Image
        source={require("../../assets/images/dummy_qr.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.forgeText}>Forge Scan</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 70,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DBDCFF",
  },
  forgeText: {
    color: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  },
});
