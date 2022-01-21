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
import * as Notifications from "expo-notifications";
import { Bar } from "react-native-progress";

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
  const [tagFashion, setTagFashion] = useState(0);
  const [tagPerfume, setTagPerfume] = useState(0);
  const [tagKitchen, setTagKitchen] = useState(0);
  const [tagGeneral, setTagGeneral] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [numComments, setNumComments] = useState(0);
  const [numLikes, setNumLikes] = useState(0);

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
        var comments = 0;
        var likes = 0;
        for (var x = 0; x < Ausers.length; x++) {
          comments += Number(Ausers[x].commentsNum);
          likes += Number(Ausers[x].likes);
        }
        setNumComments(comments);
        setNumLikes(likes);
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
    const ArticleTagFashion = db
      .collection("Articles")
      .where("tag", "==", "fashion")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTagFashion(Ausers.length);
      });
    const ArticleTagKitchen = db
      .collection("Articles")
      .where("tag", "==", "kitchen")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTagKitchen(Ausers.length);
      });
    const ArticleTagPerfume = db
      .collection("Articles")
      .where("tag", "==", "perfume")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTagPerfume(Ausers.length);
      });

    const ArticleTagGeneral = db
      .collection("Articles")
      .where("tag", "==", "general")
      .onSnapshot((querySnapshot) => {
        const Ausers = [];

        querySnapshot.forEach((documentSnapshot) => {
          Ausers.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setTagGeneral(Ausers.length);
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
        <Text style={{ color: "white" }}>
          {items.access == "user" ? "Regular" : "Business"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#090C21" }}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          <Card title="Regular users" usersize={userSize} />
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Verify")}
          >
            <Text style={{ color: "#8D8E98", fontSize: 18 }}>
              Business users
            </Text>
            <Text style={{ color: "white", fontSize: 50, fontWeight: "bold" }}>
              {adminSize}
            </Text>
          </TouchableOpacity>
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
            <Text style={{ color: "#8D8E98", fontSize: 18 }}>Articles</Text>
            <Text style={{ color: "white", fontSize: 50, fontWeight: "bold" }}>
              {articleSize}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Users")}>
            <View style={styles.card}>
              <Text style={{ color: "#8D8E98", fontSize: 18 }}>Users</Text>
              <Text
                style={{ color: "white", fontSize: 50, fontWeight: "bold" }}
              >
                {userSize + adminSize}
              </Text>
              <View style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "blueviolet",
                      borderRadius: 5,
                      marginHorizontal: 5,
                    }}
                  />
                  <Text style={{ color: "white" }}>Regular</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: "indigo",
                      borderRadius: 5,
                      marginHorizontal: 5,
                    }}
                  />
                  <Text style={{ color: "white" }}>Business</Text>
                </View>
              </View>
              <Bar
                progress={
                  userSize == 0
                    ? 0
                    : userSize / parseInt(`${userSize + adminSize}`)
                }
                width={100}
                color="blueviolet"
                unfilledColor="indigo"
                borderColor="black"
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 10,
          }}
        >
          <Card title="Comments" usersize={numComments} />
          <Card title="Likes" usersize={numLikes} />
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Card title="Fashion" usersize={tagFashion} />
          <Card title="Kitchen" usersize={tagKitchen} />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Card title="Perfume" usersize={tagPerfume} />
          <Card title="General" usersize={tagGeneral} />
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
