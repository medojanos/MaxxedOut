import { View, Text, ScrollView, Pressable, TextInput, Linking } from "react-native";
import { useContext, useState, useEffect } from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from "react-native-vector-icons/Ionicons";

// Misc
import { Context } from "../../misc/Provider";
import RandomName from "../../misc/RandomName";
import Constants from 'expo-constants';
import ModalOverlay from "../../components/ModalOverlay";
import useApiFetch from "../../misc/ApiFetch";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Settings() {
    const {userData, Refresh, Logout, setUserData} = useContext(Context);

    const [nicknameModal, setNicknameModal] = useState(false);
    const [newNickname, setNewNickname] = useState("");
    const [status, setStatus] = useState("");
    const [passwordModal, setPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRepassword, setNewRepassword] = useState("");
    const [pwdStrength, setPwdStrength] = useState("");
    const [picker, setPicker] = useState(false);

    const apiFetch = useApiFetch();

    useEffect(() => {
        if (!status) return;
        const timeout = setTimeout(() => setStatus(""), 2000)
        return () => clearTimeout(timeout);
    }, [status])

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
                        <Pressable onPress={() => {setNicknameModal(true); setStatus(null);}}>
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
                {status ? <Text style={MainStyle.lightText}>{status}</Text> : null}
                <View style={MainStyle.inlineContainer}>
                    <TextInput
                        value={newNickname}
                        placeholder="Enter new nickname..."
                        style={[MainStyle.input, {width: "60%"}]}
                        onChangeText={text => {
                            if (text.length > 20) return setStatus("Nickname cannot be longer than 20 characters");
                            setNewNickname(text);
                        }}>
                    </TextInput>
                    <Pressable onPress={() => {setNewNickname(RandomName());}}>
                        <Ionicons name="dice-outline" color={Var.red} size={25}></Ionicons>
                    </Pressable>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                        apiFetch("/users", {
                            method: "PATCH",
                            body: JSON.stringify({
                                "nickname" : newNickname
                            })
                        })
                        .then(async res => {
                            const data = await res.json();
                            if (!res.ok) throw new Error(data.error)
                            setUserData(prev => ({...prev, nickname: newNickname}));
                            setStatus(data.message);
                            setTimeout(() => {setNicknameModal(false)}, 2000);
                        })
                        .catch(err => setStatus(err.message));
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
                            style={[MainStyle.input, MainStyle.setInput, {marginHorizontal: 10}]}
                            value={userData.preferences?.restingTime.minutes.toString() || 0}
                            onChangeText={text => {
                                if (text !== "" && !/^\d+$/.test(text) || Number(text) > 59) return;
                                setUserData(prev => ({...prev, preferences: {...prev.preferences, restingTime: {...prev.preferences.restingTime, minutes: Number(text)}}}));
                                Refresh()
                                }}>
                        </TextInput>
                        <Text style={MainStyle.lightText}>mins</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={[MainStyle.input, MainStyle.setInput, {marginHorizontal: 10}]}
                            value={userData.preferences?.restingTime.seconds.toString()}
                            onChangeText={text => {
                                if (text !== "" && !/^\d+$/.test(text) || Number(text) > 59) return;
                                setUserData(prev => ({...prev, preferences: {...prev.preferences, restingTime: {...prev.preferences.restingTime, seconds: Number(text)}}}));
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
                    <Text style={MainStyle.buttonText} onPress={() => {setPasswordModal(true); setPwdStrength("")}}>Password reset</Text>
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
            <Pressable style={MainStyle.button} onPress={() => Logout()}>
                <Text style={MainStyle.buttonText}>Logout</Text>
            </Pressable>
            <ModalOverlay visible={passwordModal} onClose={() => setPasswordModal(false)}>
                <Text style={MainStyle.screenTitle}>Edit password</Text>
                {status ? <Text style={MainStyle.lightText}>{status}</Text> : null}
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
                {pwdStrength ? <Text style={MainStyle.strongText}>{pwdStrength}</Text> : null}
                <View style={MainStyle.inlineContainer}>
                    <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                        setStatus("");
                        if (pwdStrength == "") return setStatus("Enter valid password")
                        if (pwdStrength == "Weak") return setStatus("Password is too weak");
                        if (newPassword != newRepassword) return setStatus("Passwords do not match");
                        apiFetch("/users", {
                            method: "PATCH",
                            body: JSON.stringify({
                                "password": newPassword,
                                "currentPassword": currentPassword
                            })
                        })
                        .then(res => {
                            const data = res.json();
                            if (!res.ok) throw new Error(data.error)
                            setStatus(data.message);
                            setTimeout(() => {setPasswordModal(false)}, 2000);
                        })
                        .catch(err => setStatus(err.message));
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
