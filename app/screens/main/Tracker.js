// React
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
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
    
})

export default function Tracker() {
    const { userData, workout, refresh } = useContext(Context);

    const navigation = useNavigation();

    const durationInterval = useRef(null);
    const restInterval = useRef(null);
    
    const [workoutModal, setWorkoutModal] = useState(false);
    const [duration, setDuration] = useState("00:00:00");
    const [restTimer, setRestTimer] = useState(formatTime(userData.preferences?.restingTime || 0));

    useEffect(() => {
        setRestTimer(formatTime(userData.preferences?.restingTime || 0));
        handleTimer();
    }, [refresh]);

    useEffect(() => {
        if (!workout) return;
        durationInterval.current = setInterval(() => {
            setDuration(() => {
                const diff = Math.floor((new Date() - new Date(workout.started_at)) / 1000);
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            });
        }, 1000);
    }, [workout]);

    function handleTimer(action) {
        clearInterval(restInterval.current);
        switch (action) {
            case "start":
                let seconds = userData.preferences.restingTime;
                restInterval.current = setInterval(() => {
                    setRestTimer(formatTime(seconds));
                    seconds--;
                }, 1000);
                break;
            case "reset":
                setRestTimer(formatTime(userData.preferences.restingTime));
                break;
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <Text style={MainStyle.titleText}>{userData ? "Welcome, " + userData.nickname : ""}</Text>
                <Text style={MainStyle.screenTitle}>Tracker</Text>
                {workout ?
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
                                <Text style={MainStyle.lightText}>{restTimer}</Text>
                            </View>
                            <View style={MainStyle.inlineContainer}>
                                <Pressable
                                    style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                                    onPress={() => {handleTimer("reset")}}>
                                    <Text style={MainStyle.buttonText}>Reset</Text>
                                </Pressable>
                                <Pressable
                                    style={[MainStyle.button, MainStyle.buttonBlock]}
                                    onPress={() => {handleTimer("start")}}>
                                    <Text style={MainStyle.buttonText}>Start</Text>
                                </Pressable>
                                <Pressable
                                    style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                                    onPress={() => {handleTimer()}}>
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