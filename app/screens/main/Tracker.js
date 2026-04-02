// React
import { View, Text, ScrollView, Pressable, Platform, Modal, TextInput } from "react-native";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import * as Notifications from "expo-notifications";

// Misc
import WorkoutModal from "../../components/modals/WorkoutModal";
import SaveModal from "../../components/modals/SaveModal";
import CancelModal from "../../components/modals/CancelModal";
import { Context } from "../../misc/Provider";
import displayTime from "../../misc/DisplayTime";
import RandomQuote from "../../misc/RandomQuote";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle";

export default function Tracker() {
    const { userData, workout, setWorkout, token } = useContext(Context);

    const navigation = useNavigation();

    const durationInterval = useRef(null);
    const [durationTimer, setDurationTimer] = useState("00:00");
    
    const restingInterval = useRef(null);
    const [remainingTime, setRemainingTime] = useState(userData.preferences?.restingTime.minutes * 60 + userData.preferences?.restingTime.seconds);
    const [restingTimer, setRestingTimer] = useState(displayTime(userData.preferences?.restingTime.minutes * 60 + userData.preferences?.restingTime.seconds));
    const [endRestingTime, setEndRestingTime] = useState(null);
    const [notificationId, setNotificationId] = useState(null);

    const [saveModal, setSaveModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [cardioModal, setCardioModal] = useState(false);
    const [workoutModal, setWorkoutModal] = useState(false);

    const [quote, setQuote] = useState(RandomQuote());

    const [status, setStatus] = useState("");

    useEffect(() => {
        return () => {
            if (durationInterval.current) clearInterval(durationInterval.current);
            if (restingInterval.current) clearInterval(restingInterval.current);
        };
    }, []);

    useEffect(() => {
        if (!restingInterval.current) {
            const totalSeconds = userData.preferences?.restingTime.minutes * 60 + userData.preferences?.restingTime.seconds;
            setRemainingTime(totalSeconds);
            setRestingTimer(displayTime(totalSeconds));
        }
    }, [userData]);

    useEffect(() => {
        if (!workout) return;
        clearInterval(durationInterval.current);
        durationInterval.current = setInterval(() => {
            const diff = Math.floor((Date.now() - new Date(workout.started_at)) / 1000);
            setDurationTimer(displayTime(diff));
        }, 1000);
        return () => clearInterval(durationInterval.current);
    }, [workout?.started_at]);

    async function handleTimer(action) {
        switch (action) {
            case "start":
                if (restingInterval.current || !remainingTime) return;
                const secs = Math.max(1, remainingTime);
                const end = new Date(Date.now() + secs * 1000 + 1000);
                setEndRestingTime(end);
                restingInterval.current = setInterval(() => {
                    const now = new Date();
                    const diff = Math.floor((end - now) / 1000);
                    if (diff <= 0) {
                        handleTimer("reset");
                        return;
                    }
                    setRemainingTime(diff);
                    setRestingTimer(displayTime(diff));
                }, 1000);
                if (Platform.OS != "web") {
                    const id = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "Resting time is over!",
                            body: "Get back to your workout!",
                            sound: "default",
                            priority: Notifications.AndroidNotificationPriority.HIGH,
                        },
                        trigger: {
                            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                            seconds: secs,
                            channelId: "resting-timer"
                        }
                    });
                    setNotificationId(id);
                }
                break;
            case "pause":
                clearInterval(restingInterval.current);
                restingInterval.current = null;
                if (endRestingTime) {
                    const now = new Date();
                    const diff = Math.max(0, Math.floor((endRestingTime - now) / 1000));
                    setRemainingTime(diff);
                    setRestingTimer(displayTime(diff));
                }
                if (notificationId && Platform.OS != "web") {
                    await Notifications.cancelScheduledNotificationAsync(notificationId);
                    setNotificationId(null);
                }
                break;
            case "reset":
                await handleTimer("pause");
                setEndRestingTime(null);
                const totalSeconds = userData.preferences?.restingTime.minutes * 60 + userData.preferences?.restingTime.seconds;
                setRemainingTime(totalSeconds);
                setRestingTimer(displayTime(totalSeconds));
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
                    {workout.type !== "cardio" ? 
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
                        <View style={MainStyle.container}>
                            <View style={MainStyle.inlineContainer}>
                                <Text style={MainStyle.strongText}>Resting timer</Text>
                                <Text style={MainStyle.lightText}>{restingTimer}</Text>
                            </View>
                            <View style={MainStyle.inlineContainer}>
                                <Pressable
                                    onPress={() => {handleTimer("pause")}}>
                                    <Ionicons name="pause-circle" size={50} color={Var.navyBlue}></Ionicons>
                                </Pressable>
                                <Pressable
                                    onPress={() => {handleTimer("start")}}>
                                    <Ionicons name="play-circle" size={60} color={Var.red}></Ionicons>
                                </Pressable>
                                <Pressable
                                    onPress={() => {handleTimer("reset")}}>
                                    <Ionicons name="stop-circle" size={50} color={Var.navyBlue}></Ionicons>
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
                                        setStatus("");
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