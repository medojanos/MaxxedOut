// React
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";
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
                        <Pressable>
                            <Ionicons name="create" color={Var.red} size={25}></Ionicons>
                        </Pressable>
                    </View>
                </View>
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