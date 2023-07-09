import * as ImagePicker from "expo-image-picker";

import { View, StyleSheet, Pressable } from "react-native";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { AppContext } from "../Contexts/Contexts";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Slider from "@react-native-community/slider";
import AlertBox from "../components/AlertBox";
import Navbar from "../components/Navbar";
import Cam from "../components/Camera";

export default function Home({ navigation }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [alertBox, setAlertBox] = useState(null);
  const [isFocus, setFocus] = useState(false);
  const [value, setValue] = useState(0);

  const { setQrcode } = useContext(AppContext);

  const toggleFlashlight = async () => {
    setFlashlightOn(!flashlightOn);
  };

  async function scanQRCodeFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const scanResult = await BarCodeScanner.scanFromURLAsync(
          result.assets[0].uri
        );
        if (scanResult.length > 0) {
          setQrcode({ date: new Date(), qr: scanResult[0] });

          navigation.navigate("Details");
        } else {
          setAlertBox("No qr-code found");
        }
      }
    }
    if (status !== "granted") {
      setAlertBox("File permission is required to scan qr-code from photo.");
    }
    setTimeout(() => {
      setAlertBox(null);
    }, 5000);
  }

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      setFocus(true);
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setFocus(false);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Navbar brand={true} navigation={navigation} />

      {alertBox && <AlertBox message={alertBox} />}

      {isFocus && <Cam flash={flashlightOn ? 2 : 0} zoom={value} />}

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={value}
          onValueChange={(newValue) => setValue(newValue)}
          minimumTrackTintColor="#CED0FF"
          maximumTrackTintColor="white"
          thumbTintColor="white"
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.actionsContainer}>
          <Pressable style={styles.iconContainer} onPress={toggleFlashlight}>
            <View>
              {flashlightOn ? (
                <Ionicons name="flash" size={32} color="black" />
              ) : (
                <Ionicons name="flash-off" size={32} color="black" />
              )}
            </View>
          </Pressable>
          <View style={{ width: "30%" }} />
          <Pressable
            style={styles.iconContainer}
            onPress={() => navigation.navigate("History")}
          >
            <View>
              <MaterialCommunityIcons name="history" size={32} color="black" />
            </View>
          </Pressable>
        </View>

        <Pressable style={styles.primeAction} onPress={scanQRCodeFromGallery}>
          <MaterialIcons name="photo" size={32} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBDCFF",
  },
  footer: {
    width: "100%",
    backgroundColor: "blue",
    position: "absolute",
    bottom: 0,
  },
  actionsContainer: {
    backgroundColor: "#DBDCFF",
    borderTopWidth: 3,
    borderColor: "#CED0FF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 10,
    paddingVertical: 16,
  },
  primeAction: {
    padding: 10,
    position: "absolute",
    left: "50%",
    bottom: 20,
    transform: [{ translateX: -40 }],
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // For Android
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "20%",
    height: 50,
    overflow: "visible",
  },
  slider: {
    width: "80%",
    zIndex: -1,
  },
  value: {
    fontSize: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanMessage: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    padding: 20,
  },
  alertBox: {},
});
