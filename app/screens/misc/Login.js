// React
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Linking } from "react-native";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

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
        textAlign: "right",
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
        fetch("http://localhost:4000/login", {
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
        .catch(e => {
            console.log(e)
        })
    }

    return (
        <SafeAreaView style={MainStyle.content}> 
            <ScrollView contentContainerStyle={{flex : 1, justifyContent : "center"}}>
                <Text style={LoginStyle.statusText}>{status}</Text>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.screenTitle}>Login</Text>
                    <TextInput 
                        placeholder="Enter your email..."
                        style={MainStyle.input}
                        onChangeText={setEmail}/>
                    <TextInput 
                        placeholder="Enter your password..."
                        style={MainStyle.input}
                        onChangeText={setPassword}
                        secureTextEntry/>
                    <Pressable
                        onPress={Authenticate}
                        style={MainStyle.button}>
                        <Text style={MainStyle.buttonText}>Login</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {Linking.openURL("http://localhost:5173/password-recovery")}}>
                        <Text style={[MainStyle.strongText, LoginStyle.forgotPassword]}>Forgot password?</Text>
                    </Pressable>
                </View>
                <View style={[MainStyle.container, MainStyle.inlineContainer]}>
                    <Text style={MainStyle.screenAltTitle}>Don't have an account?</Text>
                    <Pressable
                        onPress={() => {Linking.openURL("http://localhost:5173/registration")}}
                        style={MainStyle.button}>
                        <Text style={MainStyle.buttonText}>Register here!</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
        
    );
}