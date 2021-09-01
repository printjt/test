import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Touchable, TextInput, Image } from 'react-native'
import Icons from "react-native-vector-icons/FontAwesome";
import Collapsible from 'react-native-collapsible';
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-root-toast";
import { RootSiblingParent } from "react-native-root-siblings";

const db = firebase.firestore();
const { height, width } = Dimensions.get("window");

export default function UsersScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const inputRef = useRef()

    useEffect(() => {
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
        return () => subscriber();
    }, []);

    function sendNoti(token, body, title) {
        if (token == undefined) { Toast.show("No token available", { duration: Toast.durations.SHORT }) }
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
        const [message, setMessage] = useState("")
        return (
            <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                <View style={styles.article}>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            {items.profilePic == undefined ?
                                <Icons name="user-circle-o" size={20} style={{ paddingRight: 10 }} color="#8d7283" />
                                :
                                <Image source={{ uri: items.profilePic }} style={{ width: 25, height: 25, borderRadius: 12.5, marginRight: 10 }} resizeMode="cover" />
                            }
                            <Text style={{ color: "white" }}>
                                {items.name}
                            </Text>
                        </View>
                        <Text style={{ color: "white" }}>{items.access == "user" ? "regular" : "business"}</Text>
                    </View>
                    <Collapsible collapsed={collapsed}>
                        <Text style={styles.text}>{items.email}</Text>
                        <Text style={styles.text}>{items.uid}</Text>
                        <Text style={[styles.text, { fontSize: 10 }]}>{items.token == undefined ? "No token available" : items.token}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <TextInput placeholder="Enter message" placeholderTextColor="#8d7283" ref={inputRef} onChangeText={(message) => setMessage(message)} style={{ color: "#8d7283" }} />
                            <TouchableOpacity style={{ height: 25, width: 25, justifyContent: "center", alignItems: "center" }}
                                onPress={() => { inputRef.current.clear(); sendNoti(items.token, message, "Message") }}>
                                <Icons name="send" color="#8d7283" />
                            </TouchableOpacity>
                        </View>

                    </Collapsible>
                </View>
            </TouchableOpacity>
        );
    }


    return (
        <RootSiblingParent>
            <View style={{
                flex: 1,
                alignItems: "center",
                backgroundColor: "#090C21",
            }}>
                <FlatList
                    data={users}
                    renderItem={({ item }) => <Item items={item} />}
                    style={{ height: "100%", flexGrow: 0, marginTop: 5, marginBottom: 10 }}
                    showsVerticalScrollIndicator={false}
                    verticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                />
            </View>
        </RootSiblingParent>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "grey"
    },
    article: {
        backgroundColor: "#1D1E33",
        width: width / 1.1,
        borderRadius: 9,
        padding: 10,
        marginTop: 10,
    },
});
