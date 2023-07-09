import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, View } from "react-native";
import { useState, useContext, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { AppContext } from "../Contexts/Contexts";
import { Camera } from "expo-camera";

import AlertBox from "./AlertBox";

export default function Cam({ flash, zoom }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const { setQrcode } = useContext(AppContext);

  const navigation = useNavigation();

  const handleBarcodeScanned = (qr) => {
    setScanned(true);
    setQrcode({ date: new Date(), qr });
  };

  useEffect(() => {
    if (scanned) navigation.push("Details");
  }, [scanned]);

  // Camera permissions are still loading
  if (!permission) return <View />;

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <AlertBox message={"We need your permission to show the camera"} />
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        flashMode={flash}
        zoom={zoom}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    aspectRatio: 3 / 4,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: "red",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
