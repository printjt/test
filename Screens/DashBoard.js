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
} from "react-native";
import firebase from "firebase/app";
import "firebase/firestore";

const { height, width } = Dimensions.get("window");
LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);

const firebaseConfig = {
  apiKey: "AIzaSyBCmheorYRo48fBID-mV4sm6aFH4OkleAw",
  authDomain: "welpie.firebaseapp.com",
  projectId: "welpie",
  storageBucket: "welpie.appspot.com",
  messagingSenderId: "110019844651",
  appId: "1:110019844651:web:49dfa6edcbaa02fce4a86e",
  measurementId: "G-198X4F9HD3",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function Dashboard({ navigation }) {
  const [userSize, setUserSize] = useState(0);
  const [adminSize, setAdminSize] = useState(0);
  const [articleSize, setArticleSize] = useState(0);
  const [tagCar, setTagCar] = useState(0);
  const [tagAnimal, setTagAnimal] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //userLoad();
    const subscriber = db
      .collection("test_users")
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
    const Usize = db
      .collection("test_users")
      .where("access", "==", "user")
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUserSize(users.length);
      });
    const Asize = db
      .collection("test_users")
      .where("access", "==", "admin")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setAdminSize(Ausers.length);
      });
    const Articlesize = db
      .collection("Articles")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setArticleSize(Ausers.length);
      });
    const ArticleTagCars = db
      .collection("Articles")
      .where("tag", "==", "cars")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTagCar(Ausers.length);
      });
    const ArticleTagAnimals = db
      .collection("Articles")
      .where("tag", "==", "animals")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTagAnimal(Ausers.length);
      });
    return () => subscriber();
  }, []);

  function Card({ title, usersize }) {
    return (
      <View style={styles.card}>
        <Text style={{ color: "#8D8E98", fontSize: 18 }}>{title}</Text>
        <Text style={{ color: "white", fontSize: 50, fontWeight: "bold" }}>
          {usersize}
        </Text>
      </View>
    );
  }

  function Item({ items }) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "white" }}>{items.name}</Text>
        <Text style={{ color: "white" }}>{items.access}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ height: "100%" }}>
      <View style={styles.container}>
        {/*<View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.title}>Welpie Dashboard</Text>
        </View>*/}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          <Card title="Normal users" usersize={userSize} />
          <Card title="Business users" usersize={adminSize} />
        </View>

        <FlatList
          data={users}
          renderItem={({ item }) => <Item items={item} />}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          verticalScrollIndicator={false}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={{ color: "#8D8E98", fontSize: 18 }}>Hello</Text>
            <Text style={{ color: "white", fontSize: 50, fontWeight: "bold" }}>
              Hello
            </Text>
          </TouchableOpacity>

          <Card title="Users" usersize={userSize + adminSize} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <Card title="Comments" usersize="1589" />
          <Card title="Likes" usersize="98218" />
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text style={styles.title}>Tags</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Card title="Cars" usersize={tagCar} />
          <Card title="Animals" usersize={tagAnimal} />
        </View>
      </View>
    </ScrollView>
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
});
