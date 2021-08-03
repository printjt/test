import React from "react";
import Dashboard from "./Screens/DashBoard";
import HomeScreen from "./Screens/Main";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dash">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Welpie Dashboard",
            headerStyle: {
              backgroundColor: "#17172c",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
          }}
        />
        <Stack.Screen
          name="Dash"
          component={Dashboard}
          options={{
            title: "Welpie Dashboard",
            headerStyle: {
              backgroundColor: "#17172c",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
