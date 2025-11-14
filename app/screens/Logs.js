import { View, Text, ScrollView, Pressable } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const LogsStyle = StyleSheet.create({
    calendar : {
        backgroundColor: Var.red,
        borderRadius: 10,
        height: 365
    }
})

import { Calendar } from "react-native-calendars"

export default function Logs() {
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Logs</Text>
                <Text style={MainStyle.screenAltTitle}>Keep track of your previous workouts</Text>
            </View>

            <View style={MainStyle.container}>
                <Text style={MainStyle.containerTitle}>Calendar</Text>
                <Calendar 
                    style={LogsStyle.calendar} 
                    enableSwipeMonths
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
    );
}