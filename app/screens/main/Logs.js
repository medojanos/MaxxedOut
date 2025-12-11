// React
import { View, Text, ScrollView, StyleSheet} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

// Misc

import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import react from "react";

const LogsStyle = StyleSheet.create({
    calendar : {
        backgroundColor: Var.red,
        borderRadius: 10,
        height: 365
    }
})

export default function Logs() {
    const [selectedWorkout, setSelectedWorkout] = useState();
    const [date, setDate] = useState();
    const { token } = useContext(Context);

    /*useEffect(() => {
        fetch("http://localhost:4000/workout/" + date, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setSelectedWorkout(data.data))
    }, [date])  */

    useEffect(() => {
        console.log(date);
    }, [date])

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
                        onChange={(value, e) => setDate(value)}
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

                <View style={MainStyle.container}>
                    <Text style={MainStyle.containerTitle}>Recent logs</Text>
                    {/*Select previous 3 workouts from db*/}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}