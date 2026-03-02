// React
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Misc
import WorkoutModal from "../../components/WorkoutModal";
import { Context } from "../../misc/Provider";
import displayTime from "../../misc/DisplayTime";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Tracker() {
    const { userData, workout } = useContext(Context);

    const navigation = useNavigation();

    const durationInterval = useRef(null);
    const [duration, setDuration] = useState("00:00:00");
    
    const [workoutModal, setWorkoutModal] = useState(false);

    useEffect(() => {
        if (!workout) return;
        durationInterval.current = setInterval(() => {
            setDuration(() => {
                const diff = Math.floor((new Date() - new Date(workout.started_at)) / 1000);
                return displayTime(diff);
            });
        }, 1000);
        return () => clearInterval(durationInterval.current);
    }, [workout]);

    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <Text style={MainStyle.titleText}>{userData ? "Welcome, " + userData.nickname : ""}</Text>
            <Text style={MainStyle.screenTitle}>Tracker</Text>
            {
            workout ?
                <>
                    <View style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.strongText}>{workout.name}</Text>
                            <Text style={MainStyle.lightText}>{duration}</Text>
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
                            <Text style={MainStyle.lightText}>{"00:00"}</Text>
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
                                <Text style={MainStyle.buttonText}>Pause</Text>
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
            <View style={MainStyle.container}>
                <Text style={MainStyle.containerTitle}>Cardio</Text>
                <View style={MainStyle.inlineContainer}>
                    <Pressable
                        style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                        onPress={() => {

                        }}>
                        <Text style={MainStyle.buttonText}>Reset</Text>
                    </Pressable>
                    <Pressable
                        style={[MainStyle.button, MainStyle.buttonBlock]}
                        onPress={() => {

                        }}>
                        <Text style={MainStyle.buttonText}>Start</Text>
                    </Pressable>
                    <Pressable
                        style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                        onPress={() => {
                            
                        }}>
                        <Text style={MainStyle.buttonText}>Pause</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}