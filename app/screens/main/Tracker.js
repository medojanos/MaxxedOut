// React
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
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
    const { userData, workout } = useContext(Context);
    const navigation = useNavigation();
    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <Text style={MainStyle.screenTitle}>Tracker</Text>
                <Text style={TrackerStyle.welcome}>{userData ? "Welcome, " + userData.nickname : ""}</Text>
                {workout ?
                    <>
                    <View style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.strongText}>{workout.name}</Text>
                            <Text style={MainStyle.lightText}>00:00</Text>
                        </View>
                        <Pressable
                            style={MainStyle.button}
                            onPress={() => navigation.navigate("Workout")}>
                            <Text style={MainStyle.buttonText}>Continue workout</Text>
                        </Pressable>
                    </View>
                    <View style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.strongText}>Resting timer</Text>
                            <Text style={MainStyle.lightText}>{userData.preferences.restingTime}</Text>
                        </View>
                        <View style={MainStyle.inlineContainer}>
                            <Pressable
                                style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                                onPress={() => {}}>
                                <Text style={MainStyle.buttonText}>Reset</Text>
                            </Pressable>
                            <Pressable
                                style={[MainStyle.button, MainStyle.buttonBlock]}
                                onPress={() => {}}>
                                <Text style={MainStyle.buttonText}>Start</Text>
                            </Pressable>
                            <Pressable
                                style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                                onPress={() => {}}>
                                <Text style={MainStyle.buttonText}>Stop</Text>
                            </Pressable>
                            
                        </View>
                    </View>
                    </>
                    : 
                    <Pressable 
                        style={MainStyle.button}
                        onPress={() => {setWorkoutModal(true)}}>
                        <Ionicons style={{margin: "auto"}} name="add-circle" size={50} color={Var.black}></Ionicons>
                    </Pressable> 
                }
                <WorkoutModal 
                    visible={workoutModal} 
                    Close={() => setWorkoutModal(false)}>
                </WorkoutModal>
            </ScrollView>
        </SafeAreaView>
    );
}