// React
import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Misc
import WorkoutModal from "../../components/WorkoutModal";
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Tracker() {
    const { userData, workout } = useContext(Context);

    const navigation = useNavigation();

    const restStart = useRef(null);
    const restInterval = useRef(null);
    const durationInterval = useRef(null);

    const [restingTimer, setRestingTimer] = useState("00:00");
    const [duration, setDuration] = useState("00:00:00");
    
    const [workoutModal, setWorkoutModal] = useState(false);

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
        return () => clearInterval(durationInterval.current);
    }, [workout]);

    function handleTimer(action) {
        clearInterval(restInterval.current);
        switch (action) {
            case "start":
                if (!restStart.current) restStart.current = new Date();
                restInterval.current = setInterval(() => {
                    setRestingTimer(() => {
                        const elapsed = new Date() - restStart.current;
                        const remaining = userData.preferences.restingTime * 1000 - elapsed;
                        if (remaining <= 0) handleTimer("reset"); // Push notification here
                        const minutes = Math.floor(remaining / 60000);
                        const seconds = Math.ceil((remaining % 60000) / 1000);
                        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    });
                }, 1000);
                break;
            case "reset":
                restStart.current = null;
                setRestingTimer("00:00");
                break;
        }
    }

    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
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
                            <Text style={MainStyle.lightText}>{restingTimer}</Text>
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
                                onPress={() => {handleTimer("stop")}}>
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
            <View style={MainStyle.container}>
                <Text style={MainStyle.containerTitle}>Start Cardio</Text>
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
                        <Text style={MainStyle.buttonText}>Stop</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}