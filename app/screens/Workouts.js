import { View, Text, Pressable, ScrollView } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const WorkoutsStyle = StyleSheet.create({
    newWorkout: {
        backgroundColor: Var.paleRed,
        width: 300,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 50,
        paddingVertical: 20
    },
    workouts: {
        backgroundColor: Var.paleWhite,
        width: 300,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 50,
        paddingVertical: 20,
        marginTop: 20
    },
})

export default function Workouts() {
    return (
        <ScrollView contentContainerStyle={MainStyle.container}>
            <Pressable style={WorkoutsStyle.newWorkout}><Text style={MainStyle.textLight}>New workout...</Text></Pressable>
            <Pressable style={WorkoutsStyle.workouts}><Text style={MainStyle.textDark}>Deadlift Back</Text></Pressable>
        </ScrollView>
        
    );
}