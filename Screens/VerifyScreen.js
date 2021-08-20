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
import Icons from "react-native-vector-icons/FontAwesome";
LogBox.ignoreLogs(["Setting a timer"]);

const db = firebase.firestore();
const { height, width } = Dimensions.get("window");

export default function VerifyScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = db
      .collection("test_users")
      .where("access", "==", "admin")
      .onSnapshot((querySnapshot) => {
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

  function setVerify(uid, state) {
    db.collection("test_users").doc(uid).update({ verified: state });
    console.log(typeof uid);
    console.log(uid);
  }

  function Item({ items }) {
    return (
      <View style={styles.article}>
        <Text style={{ color: "white" }}>
          {`${items.name}    isVerified: ${items.verified}`}
        </Text>
        <Text style={{ color: "white" }}></Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => setVerify(items.uid, true)}>
            <Icons
              name="check"
              color="green"
              size={20}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVerify(items.uid, false)}>
            <Icons name="close" color="red" size={20} />
          </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
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
