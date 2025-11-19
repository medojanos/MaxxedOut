import { View, Text, ScrollView, Pressable } from "react-native";

import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { StyleSheet } from "react-native";
const StatisticsStyle = StyleSheet.create({

})

export default function Statistics() {
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Statistics</Text>
                <Text style={MainStyle.screenAltTitle}>Datas of all your workouts</Text>
            </View>
        </ScrollView>
    );
}