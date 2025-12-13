// React
import { View, Text, ScrollView, StyleSheet, Pressable} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

// Misc

import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import react from "react";
import LogModal from "../../components/LogModal";

const LogsStyle = StyleSheet.create({
    calendar : {
        backgroundColor: Var.red,
        borderRadius: 10,
        height: 365
    }
})

export default function Logs() {
    const [workouts, setWorkouts] = useState();
    const [recentWorkouts, setRecentWorkouts] = useState();
    const [logModal, setLogModal] = useState(false);
    const [status, setStatus] = useState();
    const { token } = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/workout/recent" + 5, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => {
            data.success ?? setRecentWorkouts(data.data);
        })
    }, [])

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    <Text style={MainStyle.screenTitle}>Logs</Text>
                    <Text style={MainStyle.screenAltTitle}>Keep track of your previous workouts</Text>
                </View>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.containerTitle}>Calendar</Text>
                    <Calendar 
                        style={LogsStyle.calendar} 
                        enableSwipeMonths
                        onDayPress={day => {
                            fetch("http://localhost:4000/workout/" + day.dateString, {headers: {"Authorization" : token}})
                            .then(res => res.json())
                            .then(data => {
                                setStatus();
                                setWorkouts();
                                data.success ? setWorkouts(data.data) : setStatus(data.message);
                                setLogModal(true);
                            })
                        }}
                        theme={{
                            todayTextColor : Var.red,
                            monthTextColor: Var.white,
                            arrowColor: Var.black,
                            calendarBackground : Var.black,
                            textDayStyle: {color: Var.white},
                            textDisabledColor: Var.paleRed
                        }}>
                    </Calendar>
                </View>
                <LogModal
                    visible={logModal}
                    status={status}
                    Close={() => setLogModal(false)}
                    workouts={workouts}>
                </LogModal>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.containerTitle}>Recent logs</Text>
                        <View style={MainStyle.overlay}>
                            <View style={MainStyle.container}>
                                    {recentWorkouts?.map((workout, workoutIndex) => (
                                        <View key={workout.id}>
                                            <Text style={MainStyle.screenTitle}>{workout?.name || status}</Text>
                                            {workout.workout.map((exercise, exerciseIndex) => (
                                                <View key={`${exercise.id ?? "custom"}${exerciseIndex}`} style={MainStyle.container}>
                                                    <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                                                    {exercise.sets.map((_, setIndex) => (
                                                        <View key={`${exercise} - ${setIndex}`} style={MainStyle.inlineContainer}>
                                                            <Text style={MainStyle.lightText}>Kg: {exercise.sets[setIndex].kg} </Text>
                                                            <Text style={MainStyle.lightText}>Rep: {exercise.sets[setIndex].rep} </Text>
                                                        </View>
                                                    ))}
                                                </View>
                                                ))
                                            }
                                        </View> 
                                    ))}
                            </View>
                        </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}