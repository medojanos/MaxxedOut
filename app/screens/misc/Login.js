// React
import { View, Text, TextInput, Pressable, StyleSheet, Linking } from "react-native";
import { useContext, useState } from "react";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";
import AlertBox from "../../components/AlertBox";
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
    const [status, setStatus] = useState(null); 
    const [heading, setHeading] = useState(null);
    const [alert, setAlert] = useState(false);

    const { setRefreshToken, setAccessToken, setUserData } = useContext(Context);

    async function Authenticate() {
        setAlert(false)
        setHeading(null)
        setStatus(null)
        try {
            const res = await fetch(Constants.expoConfig.extra.API_URL + "/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const data = await res.json();

            if (res.ok) {
                setRefreshToken(data.data.refresh_token);
                setAccessToken(data.data.access_token);
                setUserData(data.data.userData);
            } else {
                setAlert(true)
                setStatus(data.error);
            }
        }
        catch (error) {
            setAlert(true)
            setHeading("Oops! Something went wrong.")
            setStatus("Please try again later.")
        };
    }

    return (
        <View style={MainStyle.content}>
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
                <AlertBox closable heading={heading} message={status} onClose={() => setAlert(false)} visible={alert}/>
                </View>
            </View>
            <View style={{height: "20%"}}>
                <Pressable
                    onPress={Authenticate}
                    style={MainStyle.button}>
                    <Text style={MainStyle.buttonText}>Login</Text>
                </Pressable>
                <Pressable
                    onPress={() => {Linking.openURL(Constants.expoConfig.extra.WEB_URL + "/password-recovery")}}>
                    <Text style={[MainStyle.strongText, LoginStyle.forgotPassword]}>Forgot password?</Text>
                </Pressable>
                <View style={{marginTop: "auto"}}>
                    <View style={[MainStyle.inlineContainer, {margin: "auto"}]}>
                        <Text style={[MainStyle.lightText, {marginEnd: 5}]}>Don't have an account?</Text>
                        <Pressable
                            onPress={() => {Linking.openURL(Constants.expoConfig.extra.WEB_URL + "/registration")}}>
                            <Text style={MainStyle.strongText}>Register here!</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}
