import React, { useEffect, useState, useRef, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import firebase from "firebase/app";
import "firebase/firestore";
import RBSheet from "react-native-raw-bottom-sheet";
import ProgressiveImage from "./ProgressiveImage";
import SkeletonContent from "react-native-skeleton-content";

const db = firebase.firestore();
const { height, width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const rbRef = useRef();
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
      setTimeout(() => setLoading(false), 500);
      //setLoading(false);
    });
    return () => subscriber();
  }, []);

  function Item({ items }) {
    return (
      <View style={styles.article}>
        <SkeletonContent
          containerStyle={{ flex: 1 }}
          isLoading={loading}
          animationType="shiver"
          highlightColor="aliceblue"
          layout={[
            { key: "0", width: 40, height: 40, borderRadius: 20 },
            {
              key: "1",
              width: 180,
              height: 20,
              marginTop: -40,
              marginBottom: 20,
              marginLeft: 50,
            },
            {
              key: "2",
              width: 100,
              height: 20,
              marginTop: -10,
              marginBottom: 20,
              marginLeft: 50,
            },
            {
              key: "3",
              width: 300,
              height: 20,
              marginTop: -10,
              marginBottom: 20,
              marginLeft: 20,
            },
            {
              key: "4",
              width: "90%",
              height: 200,
              borderRadius: 10,
              marginLeft: 20,
              marginBottom: 10,
            },
          ]}
        >
          <View style={styles.header}>
            {items.profile == "" ? (
              <Icon name="user-circle" size={40} color="lightgrey" />
            ) : (
              <Image
                source={{ uri: items.profile }}
                style={styles.profilePhoto}
              />
            )}

            <View style={{ paddingLeft: 5 }}>
              <Text style={{ fontWeight: "bold", color: "white" }}>
                {items.Name}
              </Text>
              <Text style={{ fontSize: 12, color: "white" }}>
                {moment(items.timestamp).fromNow()}
              </Text>
            </View>
            <View style={{ position: "absolute", right: 0 }}>
              <TouchableOpacity
                onPress={async () => {
                  await setId(items.key);
                  rbRef.current.open();
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Entypo name="dots-three-vertical" color="white" size={15} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 12, color: "white" }}>{items.text}</Text>
            <ProgressiveImage
              defaultImageSource={require("../assets/default-img.jpg")}
              source={{ uri: items.Image }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 10,
              }}
              resizeMode="cover"
            />
          </View>
        </SkeletonContent>
      </View>
    );
  }

  function BottomSheet() {
    return (
      <RBSheet ref={rbRef} height={50}>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => deletePost(id)}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>DELETE</Text>
        </TouchableOpacity>
      </RBSheet>
    );
  }

  function deletePost(postID) {
    db.collection("Articles").doc(postID).delete();
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

      <BottomSheet />
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
