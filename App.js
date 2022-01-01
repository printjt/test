import React, { useEffect, useState } from "react";
import Dashboard from "./Screens/DashBoard";
import HomeScreen from "./Screens/Main";
import VerifyScreen from "./Screens/VerifyScreen";
import UsersScreen from "./Screens/UsersScreen";
import { Alert, View, Text, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as auth from "expo-local-authentication";
import * as Updates from "expo-updates";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Toast from "react-native-root-toast";
import { RootSiblingParent } from "react-native-root-siblings";
import * as Network from "expo-network";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const { height, width } = Dimensions.get("window");
async function authenticate() {
  const state = await auth.authenticateAsync();
  if (state.success == true) {
    return true;
  } else {
    authenticate();
  }
}

async function checkUpdate() {
  const net = await Network.getNetworkStateAsync();
  if (!net.isInternetReachable) {
    toast.show("No internet", { duration: Toast.durations.SHORT });
    return true;
  }
  let toast = Toast.show("Checking", {
    duration: Toast.durations.SHORT,
    backgroundColor: "grey",
  });

  const update = await Updates.fetchUpdateAsync();
  const check = await Updates.checkForUpdateAsync();
  try {
    if (check.isAvailable) {
      Alert.alert("Update available", "", [
        { text: "Install", onPress: () => Updates.reloadAsync() },
        {
          text: "Cancel",
          onPress: () => console.log("cancel"),
          style: "cancel",
        },
      ]);
    } else {
      Alert.alert("Latest version installed");
    }
  } catch (e) {
    console.log(e);
  }
}

export default function App({ navigation }) {
  authenticate();
  const [token, setToken] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#090C21" }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Drawer">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Articles",
              headerStyle: {
                backgroundColor: "#17172c",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                color: "white",
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Verify"
            component={VerifyScreen}
            options={{
              title: "Verify user",
              headerStyle: {
                backgroundColor: "#17172c",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                color: "white",
              },
              headerTintColor: "white",
            }}
          />
          <Stack.Screen
            name="Drawer"
            component={DrawerApp}
            options={{
              headerStyle: {
                backgroundColor: "#17172c",
              },
              headerTitle: () => Header({ navigation }),
            }}
          />
          <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{
              title: "Users",
              headerStyle: {
                backgroundColor: "#17172c",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                color: "white",
              },
              headerTintColor: "white",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

function DrawerApp() {
  return (
    <Drawer.Navigator drawerContent={() => <DrawerContent />}>
      <Drawer.Screen
        name="Dash"
        component={Dashboard}
        options={{
          headerStyle: {
            backgroundColor: "#17172c",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "red",
          },
        }}
      />
    </Drawer.Navigator>
  );
}

function DrawerContent() {
  return (
    <RootSiblingParent>
      <View
        style={{
          backgroundColor: "#090C21",
          alignItems: "center",
          height: "100%",
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            width: "75%",
            borderRadius: 10,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1D1E33",
            bottom: 50,
          }}
          onPress={() => checkUpdate()}
        >
          <Text style={{ color: "white" }}>Check for update</Text>
        </TouchableOpacity>
        <Text style={{ color: "grey", position: "absolute", bottom: 25 }}>
          {Updates.manifest.version}
        </Text>
      </View>
    </RootSiblingParent>
  );
}

function Header() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(true);
  return (
    <View
      style={{
        flexDirection: "row",
        height: "100%",
        width: "100%",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
          open ? setOpen(false) : setOpen(true);
        }}
      >
        {open ? (
          <Icon name="menu" size={25} color="white" />
        ) : (
          <Icon name="close" size={25} color="white" />
        )}
      </TouchableOpacity>
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 20,
          marginLeft: height / 11,
        }}
      >
        Welpie Dashboard
      </Text>
    </View>
  );
}
