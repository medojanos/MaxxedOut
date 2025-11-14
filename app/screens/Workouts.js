import { View, Text, ScrollView, Pressable } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const WorkoutsStyle = StyleSheet.create({

})

export default function Workouts() {
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Workouts</Text>
                <Text style={MainStyle.screenAltTitle}>Create or edit your workout plans</Text>
            </View>
        </ScrollView>
        
    );
}