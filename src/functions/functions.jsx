import * as Linking from "expo-linking";
import * as SQLite from "expo-sqlite";

import { Share } from "react-native";

const db = SQLite.openDatabase("myDatabase.db");

export const handleShare = async (qrcode) => {
  if (qrcode) {
    try {
      await Share.share({
        message: qrcode,
      });
    } catch (error) {
      console.log("Sharing failed with error:", error);
    }
  }
};

export const handleSearch = async (qrcode) => {
  if (qrcode) {
    const trueUrl = ["https://", "http://", "upi://"];

    let url = `https://www.google.com/search?q=${encodeURIComponent(qrcode)}`;

    for (let i = 0; i < trueUrl.length; i++) {
      const element = trueUrl[i];
      if (qrcode.startsWith(element)) {
        url = qrcode;
        break;
      }
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Cannot open URL: ", url);
    }
  }
};

export const handleAddItem = (date, qrData) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM myData WHERE date = ?",
      [date.toISOString()],
      (_, { rows }) => {
        if (rows.length === 0) {
          tx.executeSql(
            "INSERT INTO myData (date, qrData) VALUES (?, ?)",
            [date.toISOString(), JSON.stringify(qrData)],
            updateItems,
            (tx, error) => console.log("Error inserting data:", error)
          );
        }
      }
    );
  });
};

export const updateItems = () => {
  db.transaction((tx) => {
    tx.executeSql("SELECT * FROM myData", [], (_, { rows }) => {
      const items = rows._array.map((item) => ({
        date: new Date(item.date),
        qr: JSON.parse(item.qrData),
      }));
      return items;
    });
  });
};

export const deleteItemsByDate = (dates) => {
  db.transaction(
    (tx) => {
      const placeholders = dates.map(() => "?").join(", ");
      const sql = `DELETE FROM myData WHERE date IN (${placeholders})`;
      tx.executeSql(sql, dates);
    },
    null,
    updateItems
  );
};

export function formateDate(date) {
  const itemDate = date.getDate();
  const newDate = new Date();

  if (itemDate !== newDate.getDate()) {
    return date.toLocaleDateString("en-GB");
  }
  if (itemDate === newDate.getDate()) {
    return date.toLocaleTimeString("en-US");
  }
  return "N/A";
}

export function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("myDatabase.db");
  return db;
}
