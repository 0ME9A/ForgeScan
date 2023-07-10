import * as SQLite from "expo-sqlite";

import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";
import { formateDate } from "../functions/functions";
import { AppContext } from "../Contexts/Contexts";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

import AlertBox from "../components/AlertBox";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const db = SQLite.openDatabase("myDatabase.db");

export default function Home({ navigation }) {
  const { setQrcode } = useContext(AppContext);

  const [hisListToDelete, setHisListToDelete] = useState([]);
  const [historyDb, setHistoryDb] = useState([]);
  const [isDelete, setDelete] = useState(false);
  const [isCheck, setCheck] = useState(false);
  const [alertBox, setAlertBox] = useState({
    message: null,
    color: null,
  });

  const insets = useSafeAreaInsets();

  const handleCheckbox = () => {
    if (isCheck) {
      setCheck(false);
      setHisListToDelete([]);
    } else {
      setCheck(true);
      setHisListToDelete(historyDb.map((item) => item.date));
    }
  };

  const handleAllDelete = () => {
    db.transaction(
      (tx) => {
        const placeholders = hisListToDelete.map(() => "?").join(", ");
        const sql = `DELETE FROM myData WHERE date IN (${placeholders})`;
        const dates = hisListToDelete.map((date) => date.toISOString());
        tx.executeSql(sql, dates);
      },
      (error) => {
        setAlertBox({
          message: "Error deleting data!",
          color: null,
        });
      },
      () => {
        setAlertBox({
          message: "Data deleted successfully!",
          color: "#00A86B",
        });
      }
    );

    setCheck(false);
    setDelete(false);

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM myData ORDER BY date DESC",
        [],
        (_, { rows }) => {
          const items = rows._array.map((item) => ({
            date: new Date(item.date),
            qr: JSON.parse(item.qrData),
          }));
          setHistoryDb(items);
        }
      );
    });

    setTimeout(() => {
      setAlertBox({ message: null, color: null });
    }, 5000);
  };

  const handleSingleItem = (itemDate) => {
    if (hisListToDelete.includes(itemDate)) {
      setHisListToDelete((prev) => [
        ...prev.filter((item) => item !== itemDate),
      ]);
    } else {
      setHisListToDelete((prev) => [...prev, itemDate]);
    }
  };

  const handleInfo = (info) => {
    setQrcode(info);
    navigation.navigate("Details");
  };

  useEffect(() => {
    if (hisListToDelete.length > 0 && historyDb.length > 0) setDelete(true);
    else setDelete(false);

    if (hisListToDelete.length !== historyDb.length) setCheck(false);
    if (hisListToDelete.length === historyDb.length) setCheck(true);

    if (historyDb.length === 0) {
      setCheck(false);
    }
  }, [hisListToDelete, isCheck]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM myData ORDER BY date DESC",
        [],
        (_, { rows }) => {
          const items = rows._array.map((item) => ({
            date: new Date(item.date),
            qr: JSON.parse(item.qrData),
          }));
          setHistoryDb(items);
        }
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: 50 }]}>
        <Text
          style={{
            fontSize: 20,
          }}
        >
          History
        </Text>

        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          {isDelete ? (
            <Pressable onPress={handleAllDelete}>
              <MaterialIcons name="delete-forever" size={24} color="black" />
            </Pressable>
          ) : (
            <MaterialIcons
              name="delete-forever"
              size={24}
              color="black"
              style={{ opacity: 0.3 }}
            />
          )}
          <View style={{ borderWidth: 1, opacity: 0.1, height: "50%" }} />
          <Pressable onPress={handleCheckbox}>
            {isCheck ? (
              <MaterialIcons name="check-box" size={24} color="black" />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                size={24}
                color="black"
              />
            )}
          </Pressable>
        </View>
      </View>
      {alertBox.message && (
        <View style={{ marginTop: -10 }}>
          <AlertBox message={alertBox.message} color={alertBox.color} />
        </View>
      )}
      <View style={styles.responseContainer}>
        <ScrollView>
          <View style={styles.responseSubContainer}>
            {historyDb &&
              historyDb.map((item, index) => {
                if (item.qr) {
                  return (
                    <View
                      style={[
                        styles.list,
                        hisListToDelete.includes(item.date) && {
                          borderColor: "red",
                        },
                      ]}
                      key={index}
                    >
                      <Pressable
                        onPress={() => handleSingleItem(item.date)}
                        style={styles.listContent}
                      >
                        <Text style={{ fontSize: 18 }}>{item.qr.data}</Text>
                        <Text style={{ paddingTop: 5, opacity: 0.5 }}>
                          {formateDate(item.date)}
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => handleInfo(item)}>
                        <View style={styles.listLink}>
                          <Ionicons
                            name="open-outline"
                            size={24}
                            color="black"
                          />
                        </View>
                      </Pressable>
                    </View>
                  );
                }
              })}
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.primeAction]}
          onPress={() => navigation.navigate("Home")}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={32} color="black" />
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
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderColor: "#CED0FF",
    padding: 20,
  },
  footer: {},
  actionsContainer: {
    backgroundColor: "#DBDCFF",
    padding: 10,
    paddingVertical: 20,
    borderTopWidth: 3,
    borderColor: "#CED0FF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconContainer: {},
  responseContainer: {
    flex: 1,
    gap: 10,
  },
  responseSubContainer: {
    flex: 1,
    paddingBottom: 100,
    gap: 5,
    overflow: "scroll",
    padding: 10
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
  listContainer: {},
  list: {
    backgroundColor: "#CED0FF",
    borderRadius: 10,
    borderLeftWidth: 3,
    borderColor: "transparent",
    flexDirection: "row",
    overflow: "hidden",
    // height: 20
  },
  listContent: {
    padding: 10,
    flex: 1,
  },
  listLink: {
    padding: 10,
    height: "100%",
    alignItems: "center",
    borderLeftWidth: 2,
    borderColor: "#DBDCFF",
    opacity: 0.8,
  },
});
