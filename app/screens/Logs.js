import { View, Text, ScrollView } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const LogsStyle = StyleSheet.create({
    calendar : {
        backgroundColor: Var.paleRed,
        borderRadius: 10,
        height: 365
    }
})

import { Calendar } from "react-native-calendars"

export default function Logs() {
    return (
        <ScrollView contentContainerStyle={MainStyle.container}>
            <View style={{width: '100%'}}>
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
        </ScrollView>
    );
}