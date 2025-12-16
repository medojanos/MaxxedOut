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
    const [latest, setLatest] = useState();
    const [logModal, setLogModal] = useState(false);
    const [status, setStatus] = useState();
    const [markedDates, setMarkedDates] = useState({});

    const { token, workout } = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/workouts/latest", {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => data.success ? setLatest(data.data) : setStatus(data.message))
    }, [workout]);

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
                        }}
                        markedDates={markedDates}
                        onMonthChange={month => {
                            fetch("http://localhost:4000/workouts/" + month.dateString, {headers: {"Authorization" : token}})
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {data.data.forEach(workout => {
                                    setMarkedDates(prev => ({
                                        ...prev,
                                        [workout.date] : {marked: true, dotColor: Var.red}
                                    }))
                                })}
                            })
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
                    {latest?.map((workout, index) => (
                        <View key={index} style={MainStyle.container}>
                            <Text style={MainStyle.lightText}>{workout.name} - {workout.date.slice(0, 10)}</Text>
                            <Pressable
                                style={MainStyle.secondaryButton}
                                onPress={() => {
                                    fetch("http://localhost:4000/workout/id/" + workout.id, {headers: {"Authorization" : token}})
                                    .then(res => res.json())
                                    .then(data => {
                                        setStatus();
                                        setWorkouts();
                                        data.success ? setWorkouts(data.data) : setStatus(data.message);
                                        setLogModal(true);
                                    })
                                }}>
                                <Text style={MainStyle.buttonText}>View details</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}