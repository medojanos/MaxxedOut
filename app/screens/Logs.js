import { View, Text } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const LogsStyle = StyleSheet.create({
    calendar : {
        backgroundColor: Var.paleRed,
        color: Var.white,
        borderRadius: 10,
        height: 365
    }
})

import { Calendar } from "react-native-calendars"

export default function Logs() {
    return (
        <View style={MainStyle.container}>
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
        </View>
    );
}