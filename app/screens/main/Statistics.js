// React
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
const StatisticsStyle = StyleSheet.create({

})

export default function Statistics() {
    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    <Text style={MainStyle.screenTitle}>Statistics</Text>
                    <Text style={MainStyle.screenAltTitle}>Datas of all your workouts</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}