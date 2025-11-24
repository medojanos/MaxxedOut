// React
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Modal } from "react-native";
import { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";
import { getData, getJson, setJson } from "../../misc/Storage";
const SettingsStyle = StyleSheet.create({
    profileContainer : {
        alignItems: "center"
    },
    nickname : {
        fontSize: 20,
        color: Var.white
    },
    containerTitle : {
        color: Var.white,
        fontSize: 20,
        textAlign: "center",
        width: "100%"
    }
})

export default function Settings() {
    const { setLogin } = useContext(Context);
    const [nicknameModal, setNicknameModal] = useState(false);
    const [userData, setUserData] = useState();
    const [token, setToken] = useState();
    const [newNickname, setNewNickname] = useState();
    useEffect(() => {
        async function load() {
            setToken(await getData("token"));
            setUserData(await getJson("user"));
        }
        load();
    },[])
    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    <Text style={MainStyle.screenTitle}>Settings</Text>
                    <Text style={MainStyle.screenAltTitle}>Manage your account and preferences</Text>
                </View>
                <View style={MainStyle.container}>
                    <View style={MainStyle.inlineContainer}>
                        <Ionicons name="person-circle" color={Var.red} size={40}></Ionicons>
                        <Text style={SettingsStyle.containerTitle}>Profile settings</Text>
                    </View>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={SettingsStyle.nickname}>Nickname: </Text>
                        <Text style={SettingsStyle.nickname}>{userData ? userData.nickname : ""}</Text>
                        <Pressable onPress={() => setNicknameModal(true)}>
                            <Ionicons name="create" color={Var.red} size={25}></Ionicons>
                        </Pressable>
                    </View>
                </View>
                <Modal 
                    animationType="fade"
                    transparent={true}
                    visible={nicknameModal}>
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}>
                            <Text style={MainStyle.screenTitle}>Edit nickname</Text>
                            <TextInput
                                placeholder="Enter new nickname..."
                                style={MainStyle.input}
                                onChangeText={setNewNickname}>
                            </TextInput>
                            <View style={MainStyle.inlineContainer}>
                                <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                                    fetch("http://localhost:4000/users", {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": token
                                        },
                                        body: JSON.stringify({
                                            "nickname" : newNickname
                                        })
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.status) {
                                            setJson("user", data.userData);
                                            setUserData(data.userData);
                                            setNicknameModal(false);
                                        }
                                    })
                                    .catch(e => console.log(e))
                                }}>
                                    <Text style={MainStyle.buttonText}>Save</Text>
                                </Pressable>
                                <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={() => setNicknameModal(false)}>
                                    <Text style={MainStyle.buttonText}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={MainStyle.container}>
                    <View style={MainStyle.inlineContainer}>
                        <Ionicons name="contrast" color={Var.red} size={40}></Ionicons>
                        <Text style={SettingsStyle.containerTitle}>Preferences</Text>
                    </View>
                    
                    <View style={MainStyle.container}>
                        
                    </View>
                </View>
                <View style={MainStyle.container}>
                    <View style={MainStyle.inlineContainer}>
                        <Ionicons name="key" color={Var.red} size={40}></Ionicons>
                        <Text style={SettingsStyle.containerTitle}>Account settings</Text>
                    </View>
                    <Text style={MainStyle.lightText}>Reset your password</Text>
                    <Pressable style={MainStyle.button}>
                        <Text style={MainStyle.buttonText}>Password reset</Text>
                    </Pressable>
                    <Pressable style={MainStyle.button} onPress={() => setLogin("false")}>
                        <Text style={MainStyle.buttonText}>Logout</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}