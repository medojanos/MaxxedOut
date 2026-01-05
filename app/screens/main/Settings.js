// React
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Modal, Linking } from "react-native";
import { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";
import RandomName from "../../misc/RandomName";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";
const SettingsStyle = StyleSheet.create({

})

export default function Settings() {
    const {userData, setUserData} = useContext(Context);

    const { token } = useContext(Context);

    const [nicknameModal, setNicknameModal] = useState(false);
    const [newNickname, setNewNickname] = useState("");
    const [status, setStatus] = useState();
    const [passwordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState("");
    const [newRepassword, setNewRepassword] = useState();
    const [pwdStrength, setPwdStrength] = useState();
    function evaluatePwdStrength(password){
        setStatus("");
        let score = 0;

        if(password.length >= 8) score += 2;
        if(password.length >= 12) score++;
        if(/[a-z]/.test(password)) score++;
        if(/[A-Z]/.test(password)) score++;
        if(/[0-9]/.test(password)) score++;
        if(/[^A-Za-z0-9]/.test(password)) score++;
    
        if (score == 7) setPwdStrength("Very strong")
        else if (score >= 6) setPwdStrength("Strong")
        else if (score > 4) setPwdStrength("Medium")
        else if (score > 0) setPwdStrength("Weak")
        else if (score == 0) setPwdStrength("")

        setNewPassword(password)
    }

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
                        <Text style={[MainStyle.containerTitle, {textAlign: "center"}]}>Profile settings</Text>
                    </View>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={MainStyle.lightText}>Nickname: </Text>
                        <Text style={MainStyle.lightText}>{userData ? userData.nickname : ""}</Text>
                        <Pressable onPress={() => {setNicknameModal(true); setStatus("");}}>
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
                            <Text style={MainStyle.screenAltTitle}>{status}</Text>
                            <View style={MainStyle.inlineContainer}>
                                <TextInput
                                    value={newNickname}
                                    placeholder="Enter new nickname..."
                                    style={MainStyle.input}
                                    onChangeText={text => {
                                        setStatus("");
                                        if (text.length > 20) return setStatus("Too long");
                                        setNewNickname(text);
                                    }}>
                                </TextInput>
                                <Pressable onPress={() => {setNewNickname(RandomName()); setStatus("");}}>
                                    <Ionicons name="dice-outline" color={Var.red} size={25}></Ionicons>
                                </Pressable>
                            </View>
                            <View style={MainStyle.inlineContainer}>
                                <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                                    fetch("http://localhost:4000/user", {
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
                                        if (data.success) {
                                            setUserData(data.data);
                                            setStatus(data.message);
                                            setTimeout(() => setNicknameModal(false), 1000);
                                        } else {
                                            setStatus(data.message);
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
                        <Text style={[MainStyle.containerTitle, {textAlign: "center"}]}>Preferences</Text>
                    </View>
                    <View style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.lightText}>Resting time: </Text>
                            <TextInput
                                keyboardType="numeric"
                                style={[MainStyle.input, MainStyle.setInput]}
                                value={userData.preferences ? userData.preferences.restingTime.toString() : ""}
                                onChangeText={text => {
                                    if (!/^\d*$/.test(text)) return;
                                    setUserData(prev => ({...prev, preferences: {...prev.preferences, restingTime: text}}))}}>
                            </TextInput>
                        </View>
                    </View>
                </View>
                <View style={MainStyle.container}>
                    <View style={MainStyle.inlineContainer}>
                        <Ionicons name="key" color={Var.red} size={40}></Ionicons>
                        <Text style={[MainStyle.containerTitle, {textAlign: "center"}]}>Account settings</Text>
                    </View>

                    <Pressable style={MainStyle.secondaryButton}>
                        <Text style={MainStyle.buttonText} onPress={() => {setPasswordModal(true); setPwdStrength(""); setStatus("")}}>Password reset</Text>
                    </Pressable>
                    <Pressable 
                        style={MainStyle.button} 
                        onPress={() => Linking.openURL("http://localhost:5173/delete-account")}>
                        <View style={[MainStyle.inlineContainer, {justifyContent: "center"}]}>
                            <Text style={MainStyle.buttonText}>Delete account</Text>
                            <Ionicons name="link" color={Var.paleWhite} size={20}></Ionicons>
                        </View>
                    </Pressable>
                </View>
                <Pressable style={MainStyle.button} onPress={() => setUserData(null)}>
                    <Text style={MainStyle.buttonText}>Logout</Text>
                </Pressable>
                <Modal 
                    animationType="fade"
                    transparent={true}
                    visible={passwordModal}>
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}>
                            <Text style={MainStyle.screenTitle}>Edit password</Text>
                            <Text style={MainStyle.screenAltTitle}>{status}</Text>
                            <TextInput
                                secureTextEntry
                                placeholder="Enter current password..."
                                style={MainStyle.input}
                                onChangeText={setCurrentPassword}>
                            </TextInput>
                            <TextInput
                                secureTextEntry
                                placeholder="Enter new password..."
                                style={MainStyle.input}
                                onChangeText={evaluatePwdStrength}>
                            </TextInput>
                            <TextInput
                                secureTextEntry
                                placeholder="Reenter new password..."
                                style={MainStyle.input}
                                onChangeText={setNewRepassword}>
                            </TextInput>
                            <Text style={MainStyle.strongText}>{pwdStrength}</Text>
                            <View style={MainStyle.inlineContainer}>
                                <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                                    setStatus("");
                                    if (pwdStrength == "") return setStatus("Enter valid password")
                                    if (pwdStrength == "Weak") return setStatus("Password is too weak");
                                    if (newPassword != newRepassword) return setStatus("Passwords do not match");
                                    fetch("http://localhost:4000/user", {
                                        method: "PATCH",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": token
                                        },
                                        body: JSON.stringify({
                                            "password": newPassword,
                                            "currentPassword": currentPassword
                                        })
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            setUserData(data.data);
                                            setStatus(data.message);
                                            setTimeout(() => setPasswordModal(false), 2000);
                                        } else {
                                            setStatus(data.message);
                                        }
                                    })}}>
                                    <Text style={MainStyle.buttonText}>Save</Text>
                                </Pressable>
                                <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={() => setPasswordModal(false)}>
                                    <Text style={MainStyle.buttonText}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}