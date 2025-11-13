import { Pressable, View, Text, ScrollView} from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle";
import { StyleSheet } from "react-native";
const SettingsStyle = StyleSheet.create({
    logout : {
        backgroundColor: Var.paleRed,
        width: "75%",
        borderRadius: 5,
        padding: 10,
        borderWidth: 1
    }
})

import { Context } from "../misc/Provider";
import { useContext, useEffect } from "react";
import { setData } from "../misc/Storage";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Settings() {
    const { setLogin } = useContext(Context);
    const {nickname, setNickname} = useContext(Context);
    return (
        <ScrollView contentContainerStyle={MainStyle.container}>
            <View style={{flexDirection: "row"}}>
                <Text style={{color: Var.white, fontSize: 25}}>{nickname}Nickname</Text>
                <Pressable><Ionicons name="pencil" size={25} color={Var.red}></Ionicons></Pressable>
            </View>

            <Pressable style={SettingsStyle.logout} onPress={() => setLogin(false)}>
                <Text style={MainStyle.textLight}>Logout</Text>
            </Pressable>
        </ScrollView>
    );
}