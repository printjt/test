import { StatusBar as Status } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  LogBox,
  Image,
} from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore();
const { height, width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = db.collection("Articles").onSnapshot((querySnapshot) => {
      const users = [];

      querySnapshot.forEach((documentSnapshot) => {
        users.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });

      setUsers(users);
      setLoading(false);
    });
    return () => subscriber();
  }, []);

  function Item({ items }) {
    return (
      <View style={styles.article}>
        <View style={styles.header}>
          <Image source={{ uri: items.profile }} style={styles.profilePhoto} />
          <View style={{ paddingLeft: 5 }}>
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {items.Name}
            </Text>
            <Text style={{ fontSize: 12, color: "white" }}>
              {items.timestamp}
            </Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 12, color: "white" }}>{items.text}</Text>
          <Image
            source={{ uri: items.Image }}
            style={{
              width: width / 1.3,
              height: 150,
              borderRadius: 10,
              marginTop: 10,
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#090C21",
      }}
    >
      <FlatList
        data={users}
        renderItem={({ item }) => <Item items={item} />}
        style={{ height: "100%", flexGrow: 0, marginTop: 5, marginBottom: 10 }}
        showsVerticalScrollIndicator={false}
        verticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090C21",
    justifyContent: "space-evenly",
  },
  card: {
    backgroundColor: "#1D1E33",
    width: 170,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  list: {
    height: "50%",
    width: width * 0.9,
    flexGrow: 0,
    marginTop: 20,
    backgroundColor: "#1D1E33",
    borderRadius: 10,
    marginLeft: 21,
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  article: {
    backgroundColor: "#1D1E33",
    width: width / 1.1,
    borderRadius: 9,
    padding: 10,
    marginTop: 15,
  },
  header: {
    flexDirection: "row",
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
