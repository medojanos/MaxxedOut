// React
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

//Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
const StatisticsStyle = StyleSheet.create({

})

function OneRepMax(weight, reps) {
    return Math.round(weight / (1.0278 - 0.0278 * reps));
}

export default function Statistics() {
    const [statistics, setStatistics] = useState();

    const {token, workout} = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/statistics", {headers: {"Authorization": token}})
        .then(res => res.json())
        .then(data => setStatistics(data.data));
    }, [workout]);

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                {statistics ?
                <View>
                    <Text style={MainStyle.screenTitle}>Statistics</Text>
                    <Text style={MainStyle.screenAltTitle}>Datas of all your workouts</Text>
                    <Text style={MainStyle.screenAltTitle}>Consistency</Text>
                    <View style={MainStyle.inlineContainer}>
                        <View style={[MainStyle.container, {width: "48%"}]}>
                            <Text style={MainStyle.containerTitle}>Current weekly workout streak</Text>
                            <Text style={MainStyle.strongText}>0 weeks</Text>
                        </View>
                        <View style={[MainStyle.container, {width: "48%"}]}>
                            <Text style={MainStyle.containerTitle}>Total workouts completed</Text>
                            <Text style={MainStyle.strongText}>{statistics.totalWorkouts} workouts</Text>
                        </View>
                    </View>
                    <View style={MainStyle.container}>
                        <Text style={MainStyle.containerTitle}>Average workout duration</Text>
                        <Text style={MainStyle.strongText}>{statistics.avgDuration} minutes</Text>
                    </View>
                    <Text style={MainStyle.screenAltTitle}>Strength & volume</Text>
                    <View style={MainStyle.inlineContainer}>
                        <View style={[MainStyle.container, {width: "53%"}]}>
                            <Text style={MainStyle.containerTitle}>Personal records</Text>
                            <Text style={MainStyle.strongText}>Squat: {statistics.repsSquat} x {statistics.maxSquat} kg</Text>
                            <Text style={MainStyle.strongText}>Bench: {statistics.repsBench} x {statistics.maxBench} kg</Text>
                            <Text style={MainStyle.strongText}>Deadlift: {statistics.repsDeadlift} x {statistics.maxDeadlift} kg</Text>
                            <Text style={MainStyle.strongText}>Total: {statistics.maxSquat + statistics.maxBench + statistics.maxDeadlift} kg</Text>
                        </View>
                        <View style={[MainStyle.container, {width: "43%"}]}>
                            <Text style={MainStyle.containerTitle}>1RM</Text>
                            <Text style={MainStyle.strongText}>Squat: {OneRepMax(statistics.maxSquat, statistics.repsSquat)} kg</Text>
                            <Text style={MainStyle.strongText}>Bench: {OneRepMax(statistics.maxBench, statistics.repsBench)} kg</Text>
                            <Text style={MainStyle.strongText}>Deadlift: {OneRepMax(statistics.maxDeadlift, statistics.repsDeadlift)} kg</Text>
                            <Text style={MainStyle.strongText}>Total: {OneRepMax(statistics.maxSquat, statistics.repsSquat) + OneRepMax(statistics.maxBench, statistics.repsBench) + OneRepMax(statistics.maxDeadlift, statistics.repsDeadlift)} kg</Text>
                        </View>
                    </View>
                    <View style={MainStyle.container}>
                        <Text style={MainStyle.containerTitle}>Total volume lifted</Text>
                        <Text style={MainStyle.strongText}>{statistics.totalWeight} kg</Text>
                    </View>
                </View>
                :
                <Text style={MainStyle.strongText}>Failed to get statistics</Text>}
            </ScrollView>
        </SafeAreaView>
    );
}