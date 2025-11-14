import { View, Text, ScrollView, Pressable } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle";
import { StyleSheet } from "react-native";
import { useContext } from "react";
import { Context } from "../misc/Provider";
const TrackerStyle = StyleSheet.create({
    
})

export default function Tracker() {
    const { nickname } = useContext(Context);
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.lightText}>Welcome, {nickname}</Text>
                <Text style={MainStyle.screenTitle}>Tracker</Text>
                <Text style={MainStyle.screenAltTitle}>Start a new workout</Text>
            </View>
        </ScrollView>
    );
}