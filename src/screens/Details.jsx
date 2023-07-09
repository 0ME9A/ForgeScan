import * as Clipboard from "expo-clipboard";

import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Contexts/Contexts";
import {
  handleAddItem,
  handleSearch,
  handleShare,
} from "../functions/functions";

import Navbar from "../components/Navbar";

export default function Home({ navigation }) {
  const { qrcode } = useContext(AppContext);
  const qrData = qrcode.qr.data;

  const [isCopied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(qrData);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  useEffect(() => {
    if (qrcode.qr) handleAddItem(qrcode.date, qrcode.qr);
  }, [qrcode]);

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />

      <ScrollView style={styles.responseContainer}>
        <Text
          style={{
            fontSize: 20,
            borderBottomWidth: 2,
            paddingBottom: 10,
            borderColor: "#CED0FF",
          }}
        >
          Scan Result
        </Text>
        <View style={styles.responseSubContainer}>
          <Text style={{ fontSize: 16 }}>{qrData}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.iconContainer}
            onPress={() => handleSearch(qrData)}
          >
            <View>
              <Feather name="search" size={24} color="black" />
            </View>
          </Pressable>
          <View style={{ width: "30%" }} />
          <Pressable
            style={styles.iconContainer}
            onPress={() => handleShare(qrData)}
          >
            <View>
              <Ionicons name="share-social-sharp" size={32} color="black" />
            </View>
          </Pressable>
        </View>

        <Pressable
          style={[styles.primeAction, isCopied && styles.primeActionCopy]}
          onPress={copyToClipboard}
        >
          <FontAwesome5
            name="copy"
            size={32}
            color={isCopied ? "green" : "black"}
          />
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
  responseContainer: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  responseSubContainer: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 100,
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
    shadowOffset: { width: 100, height: 100 },
    shadowOpacity: 1,
    shadowRadius: 100,
    elevation: 10,
  },
  primeActionCopy: {
    shadowColor: "green",
    borderWidth: 3,
    borderColor: "green",
  },
});
