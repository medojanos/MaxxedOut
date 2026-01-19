// React
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Linking } from "react-native";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";
const LoginStyle = StyleSheet.create({
    statusText : {
        color: Var.white,
        fontSize: 20,
        textAlign: "center"
    },
    forgotPassword: {
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 15
    }

})

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(); 

    const { setToken, setUserData } = useContext(Context);

    function Authenticate() {
        if (!email) {
            setStatus("Enter a valid email");
            return;
        }
        if (!password) {
            setStatus("Enter a valid password");
            return;
        }
        fetch(Constants.expoConfig.extra.API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setStatus(data.message);
                setToken(data.data.token);
                setUserData(data.data.userData);
            } else {
                setStatus(data.message);
            }
        })
    }

    return (
        <SafeAreaView style={MainStyle.content}> 
            <ScrollView contentContainerStyle={{flex : 1, justifyContent : "center"}}>
                <View style={{height: "10%", alignItems: "center", justifyContent: "center"}}>
                    <Text style={MainStyle.titleText}>MaxxedOut</Text>
                </View>
                <View style={{height: "70%"}}>
                    <View style={{marginVertical: "auto"}}>
                        <Text style={[MainStyle.screenTitle, {textAlign: "center"}]}>Log In</Text>
                        <TextInput 
                            placeholder="Enter your email..."
                            style={MainStyle.input}
                            onChangeText={setEmail}/>
                        <TextInput 
                            placeholder="Enter your password..."
                            style={MainStyle.input}
                            onChangeText={setPassword}
                            secureTextEntry/>
                    <Text style={[MainStyle.lightText, {textAlign: "center"}]}>{status}</Text>
                    </View>
                </View>
                <View style={{height: "20%"}}>
                    <Pressable
                        onPress={Authenticate}
                        style={MainStyle.button}>
                        <Text style={MainStyle.buttonText}>Login</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {Linking.openURL(Config.WEB_URL + "/password-recovery")}}>
                        <Text style={[MainStyle.strongText, LoginStyle.forgotPassword]}>Forgot password?</Text>
                    </Pressable>
                    <View style={{marginTop: "auto"}}>
                        <View style={[MainStyle.inlineContainer, {margin: "auto"}]}>
                            <Text style={[MainStyle.lightText, {marginEnd: 5}]}>Don't have an account?</Text>
                            <Pressable
                                onPress={() => {Linking.openURL(Config.WEB_URL + "/registration")}}>
                                <Text style={MainStyle.strongText}>Register here!</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        
    );
}
