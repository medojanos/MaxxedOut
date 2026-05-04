// React
import { View, Text, ScrollView, StyleSheet, Pressable} from "react-native";
import { useState, useEffect, useContext } from "react";
import { Calendar } from "react-native-calendars";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';
import AlertBox from "../../components/AlertBox";
import useApiFetch from "../../misc/ApiFetch";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import LogModal from "../../components/modals/LogModal";

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
    const [offline, setOffline] = useState(false);

    const { workout, refresh } = useContext(Context);

    const apiFetch = useApiFetch();

    useEffect(() => {
        apiFetch("/workouts/?limit=5")
        .then(async res => {
            setStatus();
            const data = await res.json();
            if (res.ok) {
                setLatest(data.data);
            } else {
                setStatus(data.error);
            }
        })
        .catch(() => setOffline(true));

        const date = new Date();
        fetchMarkedDates({year: date.getFullYear(), month: date.getMonth() + 1});
    }, [refresh, workout]);

    function fetchMarkedDates(date) {
        apiFetch("/workouts?month=" + date.year + "-" + String(date.month).padStart(2, '0'))
        .then(res => res.json())
        .then(data => {
            const marks = {};
            data.data.forEach(workout => {
                marks[workout.ended_at] = {marked: true, dotColor: Var.red};
            })
            setMarkedDates(marks);
        })
    }

    function fetchWorkouts(url, param) {
        apiFetch(url + param)
        .then(async res => {
            const data = await res.json();
            setStatus();
            setWorkouts();
            res.ok ? setWorkouts(data.data) : setStatus(data.error);
        })
        .catch(() => {
            setStatus("Network error")
        });
        setLogModal(true);
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
                firstDay={1}
                onDayPress={day => fetchWorkouts("/workouts?date=", day.dateString)}
                theme={{
                    todayTextColor : Var.red,
                    monthTextColor: Var.white,
                    arrowColor: Var.black,
                    calendarBackground : Var.black,
                    textDayStyle: {color: Var.white},
                    textDisabledColor: Var.navyBlue
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
                {latest ?
                    latest.length > 0 ?
                    latest.map((workout, index) => (
                        <View key={index} style={MainStyle.container}>
                            <Text style={MainStyle.lightText}>{workout.name} - {workout.ended_at}</Text>
                            <Pressable
                                style={MainStyle.secondaryButton}
                                onPress={() => fetchWorkouts("/workouts/", workout.id)}>
                                <Text style={MainStyle.buttonText}>View details</Text>
                            </Pressable>
                        </View>
                    )) 
                    : 
                    <Text style={MainStyle.lightText}>Your logs will be displayed here!</Text>
                    :
                    <AlertBox message="Could not load workout logs" visible={offline}></AlertBox>
                }
            </View>
        </ScrollView>
    );
}
