import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { openDatabase } from "./src/functions/functions";
import { AppProvider } from "./src/Contexts/Contexts";
import { useEffect, useState } from "react";

import SplashScreen from "./src/components/SplashScreen";
import Details from "./src/screens/Details";
import History from "./src/screens/History";
import Home from "./src/screens/Home";

const Stack = createNativeStackNavigator();
const db = openDatabase();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAppReady(true);
    }, 3000);

    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS myData (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, qrData TEXT);"
      );
    });
  }, []);

  if (!appReady) return <SplashScreen />;

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
