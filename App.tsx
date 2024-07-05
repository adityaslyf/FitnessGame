import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, StyleSheet } from "react-native";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./Firebase";
import Login from "./app/screens/Login";
import List from "./app/screens/List";
import Details from "./app/screens/Details";
import GameDashboard from "./app/screens/GameDashboard";  // Import GameDashboard

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen 
        name="list" 
        component={List} 
        options={{ 
          title: "List",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <InsideStack.Screen 
        name="details" 
        component={Details} 
        options={{ 
          title: "Details",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <InsideStack.Screen 
        name="GameDashboard"  // Add GameDashboard to the stack
        component={GameDashboard} 
        options={{ 
          title: "Game Dashboard",
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
        }}
      />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log(user);
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6200ee",
  },
  headerTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  text: {
    fontSize: 18,
    color: "#333333",
    margin: 10,
  },
  button: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
