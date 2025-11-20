import { View, Text, ScrollView, Pressable, StyleSheet, Modal } from "react-native";

import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

const TrackerStyle = StyleSheet.create({
    startWorkout : {

    }
})

import WorkoutModal from "../../components/WorkoutModal";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Tracker() {
    const [workoutModal, setWorkoutModal] = useState(false);
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Tracker</Text>
                <Pressable 
                    style={MainStyle.button}
                    onPress={() => {if (!workoutModal) setWorkoutModal(true)}}>
                    <Ionicons style={{margin: "auto"}} name="add-circle" size={50} color={Var.black}></Ionicons>
                </Pressable>
                <WorkoutModal visible={workoutModal} Close={() => setWorkoutModal(false)}></WorkoutModal>
            </View>
        </ScrollView>
    );
}