import { View, Text, ScrollView, Pressable } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle";
import { StyleSheet } from "react-native";
const TrackerStyle = StyleSheet.create({
    
})

export default function Tracker() {
    return (
        <ScrollView contentContainerStyle={MainStyle.container}>
            <Pressable><Text style={MainStyle.textLight}>Start workout...</Text></Pressable>
        </ScrollView>
    );
}