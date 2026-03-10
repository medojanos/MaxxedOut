// React
import { View, Text, ScrollView, Pressable, Platform } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import * as Notifications from "expo-notifications";

// Misc
import WorkoutModal from "../../components/WorkoutModal";
import { Context } from "../../misc/Provider";
import displayTime from "../../misc/DisplayTime";
import RandomQuote from "../../misc/RandomQuote";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Tracker() {
    const { userData, workout, setWorkout } = useContext(Context);

    const navigation = useNavigation();

    const durationInterval = useRef(null);
    const [durationTimer, setDurationTimer] = useState("00:00");
    
    const restingInterval = useRef(null);
    const [restingTimer, setRestingTimer] = useState(displayTime(userData.preferences?.restingTime || 0));
    const [remainingTime, setRemainingTime] = useState(userData.preferences?.restingTime || 0);
    const [notificationId, setNotificationId] = useState(null);

    const [workoutModal, setWorkoutModal] = useState(false);

    const [quote, setQuote] = useState("");
    useEffect(() => setQuote(RandomQuote()), []);

    useEffect(() => {
        if (!workout) return;
        durationInterval.current = setInterval(() => {
            setDurationTimer(() => {
                const diff = Math.floor((new Date() - new Date(workout.started_at)) / 1000);
                return displayTime(diff);
            });
        }, 1000);
        return () => clearInterval(durationInterval.current);
    }, [workout]);

    function handleTimer(action) {
        switch (action) {
            case "start":
                clearInterval(restingInterval.current);
                restingInterval.current = setInterval(() => {
                    setRemainingTime(prev => {
                        if (prev <= 0) {
                            clearInterval(restingInterval.current);
                            setRestingTimer(displayTime(0));
                            return 0;
                        }
                        const newTime = prev - 1;
                        setRestingTimer(displayTime(newTime));
                        return newTime;
                    });
                }, 1000);
                if (Platform.OS === "android" && !notificationId) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Resting time is over!",
                            body: "Get back to your workout and crush it!"
                        },
                        trigger: remainingTime,
                    }).then(setNotificationId);
                }
                break;
            case "pause":
                clearInterval(restingInterval.current);
                if (Platform.OS === "android" && notificationId) {
                    Notifications.cancelScheduledNotificationAsync(notificationId);
                    setNotificationId(null);
                }
                break;
            case "reset":
                handleTimer("pause");
                const initialTime = userData.preferences.restingTime || 0;
                setRemainingTime(initialTime);
                setRestingTimer(displayTime(initialTime));
                break;
        }
    }

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
                            <Text style={MainStyle.lightText}>{durationTimer}</Text>
                        </View>
                        <Pressable
                            style={MainStyle.button}
                            onPress={() => navigation.navigate("Workout")}>
                            <Text style={MainStyle.buttonText}>Continue workout</Text>
                        </Pressable>
                    </View>
                    {workout.type !== "cardio" ?
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
                                onPress={() => {handleTimer("pause")}}>
                                <Text style={MainStyle.buttonText}>Pause</Text>
                            </Pressable>
                        </View>
                    </View>
                    : null}
                </>
                : 
                <>
                    <Pressable 
                        style={MainStyle.button}
                        onPress={() => {setWorkoutModal(true)}}>
                        <Ionicons style={{margin: "auto"}} name="add-circle" size={50} color={Var.black}></Ionicons>
                    </Pressable> 
                    <View style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.containerTitle}>Cardio</Text>
                            <Pressable style={[MainStyle.button, MainStyle.buttonBlock, {margin: 0}]} onPress={() => {
                                setWorkout({name: "Cardio", type: "cardio", started_at: dayjs().format("YYYY-MM-DD HH:mm:ss")})
                            }}>
                                <Text style={MainStyle.buttonText}>Start</Text>
                            </Pressable>
                        </View>
                    </View>
                </>
            }
            <View style={{flexGrow: 1, justifyContent: "center", alignItems: "center"}}>
                <Text style={MainStyle.quoteText}>
                    {quote}
                </Text>
            </View>
            <WorkoutModal 
                visible={workoutModal} 
                Close={() => setWorkoutModal(false)}>
            </WorkoutModal>
        </ScrollView>
    );
}