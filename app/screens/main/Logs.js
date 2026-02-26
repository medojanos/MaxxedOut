// React
import { View, Text, ScrollView, StyleSheet, Pressable} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import LogModal from "../../components/LogModal";

const LogsStyle = StyleSheet.create({
    calendar : {
        backgroundColor: Var.red,
        borderRadius: 10,
        padding: 10,
        marginVertical : 20
    }
})

export default function Logs() {
    const [workouts, setWorkouts] = useState();
    const [latest, setLatest] = useState();
    const [logModal, setLogModal] = useState(false);
    const [status, setStatus] = useState();
    const [markedDates, setMarkedDates] = useState({});
    const { token, workout, refresh } = useContext(Context);

    useEffect(() => {
        fetch(Constants.expoConfig.extra.API_URL + "/workouts/" + "?limit=5", {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => data.success ? setLatest(data.data) : setStatus(data.message))
        
        const date = new Date();
        fetchMarkedDates({year: date.getFullYear(), month: date.getMonth() + 1});
    }, [refresh, workout]);

    function fetchMarkedDates(date) {
        fetch(Constants.expoConfig.extra.API_URL + "/workouts" + "?month=" + date.year + "-" + String(date.month).padStart(2, '0'), {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const marks = {};
                data.data.forEach(workout => {
                    marks[workout.ended_at] = {marked: true, dotColor: Var.red};
                })
                setMarkedDates(marks);
            }
        })
    }

    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Logs</Text>
                <Text style={MainStyle.strongText}>Keep track of your previous workouts</Text>
            </View>
            <Calendar 
                style={LogsStyle.calendar} 
                enableSwipeMonths
                onDayPress={day => {
                    fetch(Constants.expoConfig.extra.API_URL + "/workouts?date=" + day.dateString, {headers: {"Authorization" : token}})
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
                onMonthChange={fetchMarkedDates}>
            </Calendar>
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
                        <Text style={MainStyle.lightText}>{workout.name} - {workout.ended_at.slice(0, 16)}</Text>
                        <Pressable
                            style={MainStyle.secondaryButton}
                            onPress={() => {
                                fetch(Constants.expoConfig.extra.API_URL + "/workouts/" + workout.id, {headers: {"Authorization" : token}})
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
    );
}
