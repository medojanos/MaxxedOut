import { View, Text, ScrollView, Pressable, TextInput, Modal, Linking } from "react-native";
import { useContext, useState } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from "react-native-vector-icons/Ionicons";

// Misc
import { Context } from "../../misc/Provider";
import RandomName from "../../misc/RandomName";
import Constants from 'expo-constants';
import ModalOverlay from "../../components/ModalOverlay";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Settings() {
    const {userData, setUserData, setWorkout} = useContext(Context);

    const { token, Refresh } = useContext(Context);

    const [nicknameModal, setNicknameModal] = useState(false);
    const [newNickname, setNewNickname] = useState("");
    const [status, setStatus] = useState();
    const [passwordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState();
    const [newPassword, setNewPassword] = useState("");
    const [newRepassword, setNewRepassword] = useState();
    const [pwdStrength, setPwdStrength] = useState();
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [picker, setPicker] = useState(false);

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
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Settings</Text>
                <Text style={MainStyle.strongText}>Manage your account and preferences</Text>
            </View>
            <View style={MainStyle.container}>
                <View style={MainStyle.inlineContainer}>
                    <Ionicons name="person-circle" color={Var.red} size={40}></Ionicons>
                    <Text style={MainStyle.containerTitle}>Profile</Text>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <Text style={MainStyle.lightText}>Nickname: </Text>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={[MainStyle.lightText, {marginEnd: 10}]}>{userData.nickname}</Text>
                        <Pressable onPress={() => {setNicknameModal(true); setStatus("");}}>
                            <Ionicons name="create" color={Var.red} size={25}></Ionicons>
                        </Pressable>
                    </View>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <Text style={MainStyle.lightText}>E-mail: </Text>
                    <Text style={MainStyle.lightText}>{userData.email}</Text>
                </View>
            </View>
            <ModalOverlay visible={nicknameModal} onClose={() => setNicknameModal(false)}>
                <Text style={MainStyle.screenTitle}>Edit nickname</Text>
                <Text style={MainStyle.lightText}>{status}</Text>
                <View style={MainStyle.inlineContainer}>
                    <TextInput
                        value={newNickname}
                        placeholder="Enter new nickname..."
                        style={[MainStyle.input, {width: "60%"}]}
                        onChangeText={text => {
                            setStatus("");
                            if (text.length > 20) return setStatus("Nickname is too long");
                            setNewNickname(text);
                        }}>
                    </TextInput>
                    <Pressable onPress={() => {setNewNickname(RandomName()); setStatus("");}}>
                        <Ionicons name="dice-outline" color={Var.red} size={25}></Ionicons>
                    </Pressable>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <Pressable disabled={saveDisabled} style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                        if (newNickname.length == 0) return setStatus("Nickname is too short");
                        fetch(Constants.expoConfig.extra.API_URL + "/user", {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": token
                            },
                            body: JSON.stringify({
                                "nickname" : newNickname
                            })
                        })
                        .then(res => res.json()
                        .then(data => {
                            setStatus(data.message);
                            if (res.ok) {
                                setUserData(data.data);
                                setSaveDisabled(true);
                                setTimeout(() => {setNicknameModal(false); setSaveDisabled(false)}, 1000);
                            }
                        }))
                    }}>
                        <Text style={MainStyle.buttonText}>Save</Text>
                    </Pressable>
                    <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={() => setNicknameModal(false)}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </ModalOverlay>
            <View style={[MainStyle.container, {zIndex: 1}]}>
                <View style={MainStyle.inlineContainer}>
                    <Ionicons name="contrast" color={Var.red} size={40}></Ionicons>
                    <Text style={MainStyle.containerTitle}>Preferences</Text>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <Text style={MainStyle.lightText}>Resting time:</Text>
                    <View style={MainStyle.inlineContainer}>
                        <TextInput
                            keyboardType="numeric"
                            style={[MainStyle.input, MainStyle.setInput]}
                            value={userData.preferences?.restingTime.minutes.toString()}
                            onChangeText={text => {
                                if (text !== "" && !/^\d+$/.test(text)) return;
                                setUserData(prev => ({...prev, preferences: {...prev.preferences, restingTime: {...prev.preferences.restingTime, minutes: text}}}));
                                Refresh()
                                }}>
                        </TextInput>
                        <Text style={MainStyle.lightText}>mins</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={[MainStyle.input, MainStyle.setInput]}
                            value={userData.preferences?.restingTime.seconds.toString()}
                            onChangeText={text => {
                                if (text !== "" && !/^\d+$/.test(text)) return;
                                setUserData(prev => ({...prev, preferences: {...prev.preferences, restingTime: {...prev.preferences.restingTime, seconds: text}}}));
                                Refresh()
                                }}>
                        </TextInput>
                        <Text style={MainStyle.lightText}>seconds</Text>
                    </View>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <Text style={MainStyle.lightText}>Bottom tab text: </Text>
                    <DropDownPicker
                        open={picker}
                        setOpen={setPicker}
                        containerStyle={{width: "30%"}}
                        style={MainStyle.input}
                        textStyle={{color: Var.white}}
                        value={userData.preferences?.bottomTabText || "Show"}
                        dropDownContainerStyle={{backgroundColor: Var.navyBlue}}
                        items={[{label: "Show", value: "Show"}, {label: "Hide", value: "Hide"}]}
                        setValue={value => setUserData(prev => ({...prev, preferences: {...prev.preferences, bottomTabText: value()}}))}>
                    </DropDownPicker>
                </View>
            </View>
            <View style={MainStyle.container}>
                <View style={MainStyle.inlineContainer}>
                    <Ionicons name="key" color={Var.red} size={40}></Ionicons>
                    <Text style={MainStyle.containerTitle}>Account</Text>
                </View>

                <Pressable style={MainStyle.secondaryButton}>
                    <Text style={MainStyle.buttonText} onPress={() => {setPasswordModal(true); setPwdStrength(""); setStatus("")}}>Password reset</Text>
                </Pressable>
                <Pressable 
                    style={MainStyle.button} 
                    onPress={() => Linking.openURL(Constants.expoConfig.extra.WEB_URL + "/delete-account")}>
                    <View style={[MainStyle.inlineContainer, {justifyContent: "center"}]}>
                        <Text style={MainStyle.buttonText}>Delete account</Text>
                        <Ionicons name="link" color={Var.paleWhite} size={20}></Ionicons>
                    </View>
                </Pressable>
            </View>
            <Pressable style={MainStyle.button} onPress={() => {
                setUserData(null);
                setWorkout(null);
            }}>
                <Text style={MainStyle.buttonText}>Logout</Text>
            </Pressable>
            <ModalOverlay visible={passwordModal} onClose={() => setPasswordModal(false)}>
                <Text style={MainStyle.screenTitle}>Edit password</Text>
                <Text style={MainStyle.lightText}>{status}</Text>
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
                    <Pressable disabled={saveDisabled} style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                        setStatus("");
                        if (pwdStrength == "") return setStatus("Enter valid password")
                        if (pwdStrength == "Weak") return setStatus("Password is too weak");
                        if (newPassword != newRepassword) return setStatus("Passwords do not match");
                        fetch(Constants.expoConfig.extra.API_URL + "/user", {
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
                        .then(res => res.json()
                        .then(data => {
                            setStatus(data.message);
                            if (res.ok) {
                                setUserData(data.data);
                                setSaveDisabled(true);
                                setTimeout(() => {setPasswordModal(false); setSaveDisabled(false)}, 2000);
                            }
                        }))
                    }}>
                        <Text style={MainStyle.buttonText}>Save</Text>
                    </Pressable>
                    <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={() => setPasswordModal(false)}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </ModalOverlay>
            <View style={MainStyle.container}>
                <View style={MainStyle.inlineContainer}>
                    <Ionicons name="information-circle" color={Var.red} size={40}></Ionicons>
                    <Text style={MainStyle.containerTitle}>About v{Constants.expoConfig.version}</Text>
                </View>
                <Text style={MainStyle.lightText}>Having trouble? Contact us at:</Text>
                <Text style={[MainStyle.lightText, MainStyle.link, {marginVertical: 10, textAlign: "right"}]} onPress={() => Linking.openURL("mailto:maxxedout@meadowhub.net")}>
                    maxxedout@meadowhub.net
                </Text>
                <Text style={[MainStyle.lightText, {textAlign: 'center'}]}>© MaxxedOut. All rights reserved.</Text>
            </View>
        </ScrollView>
    );
}
