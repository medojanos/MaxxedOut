// React
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"

const StatisticsStyle = StyleSheet.create({
    statTitle : {
        color: Var.white,
        fontSize : 20,
        fontWeight: "bold",
        marginTop : 20,
        textAlign: "right"
    }
})

function OneRepMax(weight, reps) {
    return Math.round(weight / (1.0278 - 0.0278 * reps));
}

function MostImpressive(squat, bench, deadlift) {
    const ideal = {
        squat: 1.35,
        bench: 1,
        deadlift: 1.65
    }

    const ratio = {
        squat: squat / bench,
        bench: 1,
        deadlift: deadlift / bench
    }

    const differences = {
        squat: ratio.squat - ideal.squat,
        bench: ratio.bench - ideal.bench,
        deadlift: ratio.deadlift - ideal.deadlift
    }
    
    const maxDiff = Math.max(differences.squat, differences.bench, differences.deadlift);
    
    if(maxDiff === differences.squat) return "Squat"
    if(maxDiff === differences.deadlift) return "Deadlift"
    return "Bench"
}

export default function Statistics() {
    const [statistics, setStatistics] = useState();

    const {token, workout, refresh} = useContext(Context);

    useEffect(() => {
        fetch(Constants.expoConfig.extra.API_URL + "/statistics", { headers: { "Authorization": token } })
        .then(res => res.json())
        .then(data => setStatistics(data.data));
    }, [workout, refresh]);


    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            {statistics ?
            <View>
                <Text style={MainStyle.screenTitle}>Statistics</Text>
                <Text style={MainStyle.screenAltTitle}>Datas of all your workouts</Text>
                <Text style={StatisticsStyle.statTitle}>Consistency</Text>
                <View style={MainStyle.inlineContainer}>
                    <View style={[MainStyle.container, {width: "48%"}]}>
                        <Text style={MainStyle.strongText}>Current weekly workout streak</Text>
                        <Text style={MainStyle.lightText}>{statistics.workoutStreak}</Text>
                    </View>
                    <View style={[MainStyle.container, {width: "48%"}]}>
                        <Text style={MainStyle.strongText}>Total workouts completed</Text>
                        <Text style={MainStyle.lightText}>{statistics.totalWorkouts} workouts</Text>
                    </View>
                </View>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.strongText}>Average workout duration</Text>
                    <Text style={MainStyle.lightText}>{statistics.avgDuration} minutes</Text>
                </View>
                <Text style={StatisticsStyle.statTitle}>Strength & volume</Text>
                <View style={MainStyle.inlineContainer}>
                    <View style={[MainStyle.container, {width: "53%"}]}>
                        <Text style={MainStyle.strongText}>Personal records</Text>
                        <Text style={MainStyle.lightText}>Squat: {statistics.maxSquat} kg x {statistics.repsSquat}</Text>
                        <Text style={MainStyle.lightText}>Bench: {statistics.maxBench} kg x {statistics.repsBench}</Text>
                        <Text style={MainStyle.lightText}>Deadlift: {statistics.maxDeadlift} kg x {statistics.repsDeadlift}</Text>
                        <Text style={MainStyle.lightText}>Most impressive: {MostImpressive(OneRepMax(statistics.maxSquat, statistics.repsSquat), OneRepMax(statistics.maxBench, statistics.repsBench), OneRepMax(statistics.maxDeadlift, statistics.repsDeadlift))}</Text>
                    </View>
                    <View style={[MainStyle.container, {width: "43%"}]}>
                        <Text style={MainStyle.strongText}>1RM</Text>
                        <Text style={MainStyle.lightText}>Squat: {OneRepMax(statistics.maxSquat, statistics.repsSquat)} kg</Text>
                        <Text style={MainStyle.lightText}>Bench: {OneRepMax(statistics.maxBench, statistics.repsBench)} kg</Text>
                        <Text style={MainStyle.lightText}>Deadlift: {OneRepMax(statistics.maxDeadlift, statistics.repsDeadlift)} kg</Text>
                        <Text style={MainStyle.lightText}>Total: {OneRepMax(statistics.maxSquat, statistics.repsSquat) + OneRepMax(statistics.maxBench, statistics.repsBench) + OneRepMax(statistics.maxDeadlift, statistics.repsDeadlift)} kg</Text>
                    </View>
                </View>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.strongText}>Total volume lifted</Text>
                    <Text style={MainStyle.lightText}>{statistics.totalWeight} kg</Text>
                </View>
            </View>
            :
            <Text style={MainStyle.strongText}>Failed to get statistics</Text>}
        </ScrollView>
    );
}