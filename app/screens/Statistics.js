import { View, Text, ScrollView } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const StatisticsStyle = StyleSheet.create({

})

export default function Statistics() {
    return (
        <ScrollView contentContainerStyle={MainStyle.container}>
            <Text style={MainStyle.textLight}>Statistics</Text>
        </ScrollView>
    );
}