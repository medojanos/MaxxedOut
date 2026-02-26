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

    if(squat === 0 && bench === 0 && deadlift === 0) return "None";

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
    const [oneRepMaxes, setOneRepMaxes] = useState([]);

    const {token, workout, refresh} = useContext(Context);

    useEffect(() => {
        fetch(Constants.expoConfig.extra.API_URL + "/statistics", { headers: { "Authorization": token } })
        .then(res => res.json())
        .then(data => setStatistics(data.data));
    }, [workout, refresh]);

    useEffect(() => {
        if(statistics) {
            setOneRepMaxes([
                    OneRepMax(statistics.maxSquat, statistics.repsSquat), 
                    OneRepMax(statistics.maxBench, statistics.repsBench), 
                    OneRepMax(statistics.maxDeadlift, statistics.repsDeadlift)
            ]) 
        }
    }, [statistics])

    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            {statistics && oneRepMaxes ? 
            <View>
                <Text style={MainStyle.screenTitle}>Statistics</Text>
                <Text style={MainStyle.strongText}>Datas of all your workouts</Text>
                <Text style={StatisticsStyle.statTitle}>Consistency</Text>
                <View style={MainStyle.container}>
                    <Text style={[MainStyle.strongText, {textAlign: "center"}]}>Weekly workout streak</Text>
                    <Text style={[MainStyle.lightText, {textAlign: "center"}]}>{statistics.workoutStreak} weeks</Text>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <View style={[MainStyle.container, {width: "48%"}]}>
                        <Text style={MainStyle.strongText}>Workouts completed</Text>
                        <Text style={MainStyle.lightText}>{statistics.totalWorkouts} workouts</Text>
                    </View>
                    <View style={[MainStyle.container, {width: "48%"}]}>
                        <Text style={[MainStyle.strongText, {textAlign: "right"}]}>Time spent working out</Text>
                        <Text style={[MainStyle.lightText, {textAlign: "right"}]}>{statistics.totalDuration} minutes</Text>
                    </View>
                </View>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.strongText}>Average workout duration</Text>
                    <Text style={MainStyle.lightText}>{statistics.avgDuration} minutes</Text>
                </View>
                <Text style={StatisticsStyle.statTitle}>Strength & volume</Text>
                <View style={[MainStyle.container, {}]}>
                    <Text style={[MainStyle.strongText, {textAlign: "center"}]}>Personal records</Text>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={MainStyle.lightText}>Squat: </Text>
                        <Text style={MainStyle.strongText}>{statistics.maxSquat} kg x {statistics.repsSquat}</Text>
                    </View>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={MainStyle.lightText}>Bench: </Text>
                        <Text style={MainStyle.strongText}>{statistics.maxBench} kg x {statistics.repsBench}</Text>
                    </View>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={MainStyle.lightText}>Deadlift: </Text>
                        <Text style={MainStyle.strongText}>{statistics.maxDeadlift} kg x {statistics.repsDeadlift}</Text>
                    </View>
                    <Text style={[MainStyle.lightText, {textAlign: "center"}]}>Best lift: <Text style={MainStyle.strongText}>{MostImpressive(...oneRepMaxes)}</Text></Text>
                </View>
                <View style={MainStyle.inlineContainer}>
                    <View style={[MainStyle.container, {width: "50%"}]}>
                        <Text style={MainStyle.strongText}>1 Rep Max</Text>
                        <Text style={MainStyle.lightText}>Squat: <Text style={MainStyle.strongText}>{oneRepMaxes[0]} kg</Text></Text>
                        <Text style={MainStyle.lightText}>Bench: <Text style={MainStyle.strongText}>{oneRepMaxes[1]} kg</Text></Text>
                        <Text style={MainStyle.lightText}>Deadlift: <Text style={MainStyle.strongText}>{oneRepMaxes[2]} kg</Text></Text>
                    </View>
                    <View style={[MainStyle.container, {width: "45%", height: "85%"}]}>
                        <Text style={[MainStyle.strongText, {textAlign: "center"}]}>Total</Text>
                        <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                            <Text style={[MainStyle.strongText, {textAlign: "right"}]}>{oneRepMaxes[0] + oneRepMaxes[1] + oneRepMaxes[2]} kg</Text>
                        </View>
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