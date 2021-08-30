import { StatusBar as Status } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
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
  TextInput,
} from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";
import Icons from "react-native-vector-icons/FontAwesome";
import Collapsible from 'react-native-collapsible';
import Icon from "react-native-vector-icons/FontAwesome";
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

  function setVerify(uid, state, token, body, title) {
    db.collection("test_users").doc(uid).update({ verified: state });
    sendNoti(token, body, title)
  }

  function sendNoti(token, body, title) {
    let response = fetch("https://exp.host/--/api/v2/push/send", {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: token,
        title: title,
        body: body
      })
    })
  }

  function Item({ items }) {
    const [collapsed, setCollapsed] = useState(true)
    const [body, setBody] = useState("")
    const inputRef = useRef()
    return (
      <View style={styles.article}>
        <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ color: "white" }}>
              {`${items.name}    isVerified: ${items.verified}`}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => setVerify(items.uid, true, items.token, "Your account has been verified", "Verification")}>
                <Icons
                  name="check"
                  color="green"
                  size={20}
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVerify(items.uid, false, items.token, "Your account has been unverified", "Verification")}>
                <Icons name="close" color="red" size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ color: "grey" }}>{items.email}</Text>
          <Collapsible collapsed={collapsed} duration={500} style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TextInput placeholder="Enter custom notification" placeholderTextColor="grey" style={{ color: "white" }} onChangeText={(text) => setBody(text)} ref={inputRef} />
            <TouchableOpacity>
              <Icon name="send" color="white" style={{ paddingTop: 10 }} onPress={() => { setVerify(items.uid, true, items.token, body, "Message"); inputRef.current.clear() }} />
            </TouchableOpacity>
          </Collapsible>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "#090C21",
      }}
    >
      <FlatList
        data={users}
        renderItem={({ item }) => <Item items={item} />}
        style={{ height: "100%", flexGrow: 0, marginTop: 5, marginBottom: 10 }}
        showsVerticalScrollIndicator={false}
        verticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
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
