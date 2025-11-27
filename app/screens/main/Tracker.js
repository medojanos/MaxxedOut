// React
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import WorkoutModal from "../../components/WorkoutModal";
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";
const TrackerStyle = StyleSheet.create({
    welcome : {
        color: Var.white,
        fontSize: 30,
        fontWeight: "bold"
    }
})

export default function Tracker() {
    const [workoutModal, setWorkoutModal] = useState(false);
    const { userData } = useContext(Context);
    return (
        <SafeAreaView style={{flex : 1}}>
            <ScrollView contentContainerStyle={{flex : 1}}>
                <View style={MainStyle.content}>
                    <Text style={TrackerStyle.welcome}>{userData ? "Welcome, " + userData.nickname : ""}</Text>
                    <Text style={MainStyle.screenTitle}>Tracker</Text>
                    <Pressable 
                        style={MainStyle.button}
                        onPress={() => {if (!workoutModal) setWorkoutModal(true)}}>
                        <Ionicons style={{margin: "auto"}} name="add-circle" size={50} color={Var.black}></Ionicons>
                    </Pressable>
                    <WorkoutModal visible={workoutModal} Close={() => setWorkoutModal(false)}></WorkoutModal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}