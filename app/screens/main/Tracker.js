// React
import { View, Text, ScrollView, Pressable, Platform, Modal, TextInput } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import * as Notifications from "expo-notifications";

// Misc
import WorkoutModal from "../../components/WorkoutModal";
import SaveModal from "../../components/SaveModal";
import CancelModal from "../../components/CancelModal";
import { Context } from "../../misc/Provider";
import displayTime from "../../misc/DisplayTime";
import RandomQuote from "../../misc/RandomQuote";
import Constants from "expo-constants";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Tracker() {
    const { userData, workout, setWorkout, token, refresh } = useContext(Context);

    const navigation = useNavigation();

    const durationInterval = useRef(null);
    const [durationTimer, setDurationTimer] = useState("00:00");
    
    const restingInterval = useRef(null);
    const [restingTimer, setRestingTimer] = useState(displayTime(userData.preferences?.restingTime || 0));
    const [remainingTime, setRemainingTime] = useState(userData.preferences?.restingTime || 0);
    const [notificationId, setNotificationId] = useState(null);

    const [saveModal, setSaveModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [cardioModal, setCardioModal] = useState(false);
    const [workoutModal, setWorkoutModal] = useState(false);

    const [quote, setQuote] = useState(RandomQuote());
    const [status, setStatus] = useState();

    useEffect(() => {
        if (!restingInterval.current) {
            setRemainingTime(userData.preferences?.restingTime || 0);
            setRestingTimer(displayTime(userData.preferences?.restingTime || 0));
        }
        return () => {
            clearInterval(restingInterval.current);
            restingInterval.current = null;
        }
    }, [refresh]);

    useEffect(() => {
        if (!workout) return;
        if (!durationInterval.current) {
            setDurationTimer("00:00");
            durationInterval.current = setInterval(() => {
                setDurationTimer(() => {
                    const diff = Math.floor((new Date() - new Date(workout.started_at)) / 1000);
                    return displayTime(diff);
                });
            }, 1000);
        }
        return () => {
            clearInterval(durationInterval.current);
            durationInterval.current = null;
        }
    }, [workout]);

    function handleTimer(action) {
        switch (action) {
            case "start":
                if (restingInterval.current) return;
                const secs = remainingTime;
                restingInterval.current = setInterval(() => {
                    setRemainingTime(prev => {
                        if (prev <= 0) {
                            handleTimer("reset");
                            return 0;
                        }
                        const newTime = prev - 1;
                        setRestingTimer(displayTime(newTime));
                        return newTime;
                    });
                }, 1000);
                const id = Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Resting time is over!",
                        body: "Get back to your workout!",
                        channelId: "resting-timer"
                    },
                    trigger: {seconds: secs},
                });
                setNotificationId(id);
                break;
            case "pause":
                clearInterval(restingInterval.current);
                restingInterval.current = null;
                if (notificationId) {
                    Notifications.cancelScheduledNotificationAsync(notificationId);
                    setNotificationId(null);
                }
                break;
            case "reset":
                handleTimer("pause");
                setRemainingTime(userData.preferences.restingTime || 0);
                setRestingTimer(displayTime(userData.preferences.restingTime || 0));
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
                    {workout.type !== "cardio" ? <>
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
                    </>
                    :
                    <View style={MainStyle.container}>
                        <Text style={MainStyle.lightText}>{status}</Text>
                        <View style={MainStyle.inlineContainer}>
                            <View style={MainStyle.inlineContainer}>
                                <Text style={[MainStyle.containerTitle, {marginEnd: 10}]}>{workout.name}</Text>
                                <Pressable onPress={() => setCardioModal(true)}>
                                    <Ionicons name="create" size={20} color={Var.red}></Ionicons>
                                </Pressable>
                            </View>
                            <Text style={MainStyle.lightText}>{durationTimer}</Text>
                        </View>
                        <View style={MainStyle.inlineContainer}>
                            <Pressable style={[MainStyle.button, MainStyle.buttonBlock]}
                                onPress={() => setSaveModal(true)}>
                                <Text style={MainStyle.buttonText}>Done</Text>
                            </Pressable>
                            <Pressable 
                                style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                                onPress={() => setCancelModal(true)}>
                                <Text style={MainStyle.buttonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View> 
                    }
                    <Modal visible={cardioModal} transparent={true} animationType="fade">
                        <View style={MainStyle.overlay}>
                            <View style={MainStyle.modal}>
                                <TextInput 
                                    style={MainStyle.input}
                                    value={workout.name} 
                                    onChangeText={text => {
                                        setWorkout(prev => ({...prev, name: text}));
                                        setStatus();
                                    }}>
                                </TextInput>
                                <Pressable style={MainStyle.button} onPress={() => setCardioModal(false)}>
                                    <Text style={MainStyle.buttonText}>OK</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>

                    <SaveModal                        
                        saveModal = {saveModal}
                        setSaveModal = {setSaveModal}
                        setWorkout = {setWorkout}
                        body = {{
                            name: workout.name,
                            started_at: workout.started_at,
                            ended_at: dayjs().format("YYYY-MM-DD HH:mm:ss")
                        }}
                        token={token}
                        setStatus={setStatus}
                    />
                    <CancelModal
                        cancelModal={cancelModal}
                        setCancelModal={setCancelModal}
                        setWorkout={setWorkout}
                    />
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