// React
import { View, Text, ScrollView } from "react-native";
import { useContext, useEffect, useState } from "react";

// Misc
import { Context } from "../../misc/Provider";
import AlertBox from "../../components/AlertBox";
import useApiFetch from "../../misc/ApiFetch";

// Style
import MainStyle from "../../style/MainStyle"

function MostImpressive(squat, bench, deadlift) {

    if(squat === 0 && bench === 0 && deadlift === 0) return "None";

    const ideal = {
        squat: 1.35,
        bench: 1,
        deadlift: 1.65
    }

    const ratio = {
        squat: squat / ideal.squat,
        bench: bench / ideal.bench,
        deadlift: deadlift / ideal.deadlift
    }
    
    const maxDiff = Math.max(ratio.squat, ratio.bench, ratio.deadlift);
    let lifts = [];

    if(maxDiff === ratio.squat && maxDiff === ratio.bench && maxDiff === ratio.deadlift) return "All lifts are equal";
    if(maxDiff === ratio.squat) lifts.push("Squat");
    if(maxDiff === ratio.bench) lifts.push("Bench");
    if(maxDiff === ratio.deadlift) lifts.push("Deadlift");

    return lifts.join(" & ");
}

export default function Statistics() {
    const [statistics, setStatistics] = useState();
    const [oneRepMaxes, setOneRepMaxes] = useState([]);
    const [offline, setOffline] = useState(false);

    const [exercises, setExercises] = useState([]);

    const apiFetch = useApiFetch();

    const { workout, refresh} = useContext(Context);

    useEffect(() => {
        apiFetch("/statistics")
        .then(res => res.json())
        .then(data => setStatistics(data.data))
        .catch(() => setOffline(true));
    }, [workout, refresh]);

    useEffect(() => {
        apiFetch("/statistics/getExercises")
        .then(res => res.json())
        .then(data => setExercises(data.data))
        .catch(() => setOffline(true));
    }, [workout, refresh]);

    
    useEffect(() => {
        if(exercises) {
            setOneRepMaxes([
                {onerm: Math.round(exercises.find(e => e.id === 1)?.one_rep_max || 0), weight: exercises.find(e => e.id === 1)?.weight || 0, reps: exercises.find(e => e.id === 1)?.reps || 0},
                {onerm: Math.round(exercises.find(e => e.id === 2)?.one_rep_max || 0), weight: exercises.find(e => e.id === 2)?.weight || 0, reps: exercises.find(e => e.id === 2)?.reps || 0}, 
                {onerm: Math.round(exercises.find(e => e.id === 3)?.one_rep_max || 0), weight: exercises.find(e => e.id === 3)?.weight || 0, reps: exercises.find(e => e.id === 3)?.reps || 0}
            ]);
        }
    }, [exercises])
    

    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            {statistics && oneRepMaxes ? 
            <View>
                <Text style={MainStyle.screenTitle}>Statistics</Text>
                <Text style={[MainStyle.lightText, MainStyle.sectionDescription]}>Your training progress at a glance</Text>
                <Text style={MainStyle.containerTitle}>Consistency</Text>
                <View style={MainStyle.container}>
                    <Text style={MainStyle.lightText}>WEEKLY WORKOUT STREAK</Text>
                    <Text style={MainStyle.containerTitle}>{statistics.workoutStreak} weeks</Text>
                </View>
                <View style={[MainStyle.inlineContainer, MainStyle.spacingNone, {alignItems: "stretch"}]}>
                    <View style={[MainStyle.container, {width: "48%"}]}>
                        <Text style={MainStyle.lightText}>WORKOUTS</Text>
                        <Text style={MainStyle.strongText}>{statistics.totalWorkouts} completed</Text>
                    </View>
                    <View style={[MainStyle.container, {width: "48%"}]}>
                        <Text style={MainStyle.lightText}>TIME WORKING OUT</Text>
                        <Text style={MainStyle.strongText}>{statistics.totalDuration} minutes</Text>
                    </View>
                </View>
                <View style={[MainStyle.container, MainStyle.sectionContainer]}>
                    <Text style={MainStyle.lightText}>AVERAGE SESSION</Text>
                    <Text style={MainStyle.strongText}>{statistics.avgDuration} minutes</Text>
                </View>
                <Text style={MainStyle.containerTitle}>Strength & volume</Text>
                {oneRepMaxes.some(max => max.onerm > 0) ?
                    <View>
                        <View style={MainStyle.container}>
                            <Text style={MainStyle.strongText}>Personal records</Text>
                            {["Squat", "Bench", "Deadlift"].map((lift, index) => (
                                <View key={lift} style={MainStyle.inlineContainer}>
                                    <Text style={MainStyle.lightText}>{lift}</Text>
                                    <Text style={MainStyle.strongText}>
                                        {oneRepMaxes[index].onerm > 0
                                            ? `${oneRepMaxes[index].weight} kg x ${oneRepMaxes[index].reps}`
                                            : "No record"}
                                    </Text>
                                </View>
                            ))}
                            <Text style={[MainStyle.lightText, {textAlign: "center"}]}>
                                Best lift: <Text style={MainStyle.strongText}>{MostImpressive(...oneRepMaxes.map(max => max.onerm))}</Text>
                            </Text>
                        </View>
                        <View style={[MainStyle.inlineContainer, MainStyle.spacingNone]}>
                            {["Squat", "Bench", "Deadlift"].map((lift, index) => (
                                <View key={lift} style={[MainStyle.container, {width: "31%", alignItems: "center"}]}>
                                    <Text style={MainStyle.lightText}>{lift}</Text>
                                    <Text style={MainStyle.strongText}>
                                        {oneRepMaxes[index].onerm > 0 ? `${oneRepMaxes[index].onerm} kg` : "-"}
                                    </Text>
                                    <Text style={MainStyle.lightText}>1RM</Text>
                                </View>
                            ))}
                        </View>
                        <View style={[MainStyle.container, {alignItems: "center"}]}>
                            <Text style={MainStyle.lightText}>COMBINED 1RM</Text>
                            <Text style={MainStyle.containerTitle}>
                                {Math.round(oneRepMaxes[0].onerm + oneRepMaxes[1].onerm + oneRepMaxes[2].onerm)} kg
                            </Text>
                        </View>
                    </View>
                    :
                    <View style={MainStyle.container}>
                        <Text style={MainStyle.strongText}>No personal records yet</Text>
                        <Text style={MainStyle.lightText}>Log a lift to start tracking your strength.</Text>
                    </View>
                }
                
                <View style={MainStyle.container}>
                    <Text style={MainStyle.lightText}>TOTAL VOLUME LIFTED</Text>
                    <Text style={MainStyle.strongText}>{statistics.totalWeight} kg</Text>
                </View>
            </View> 
            :
            <AlertBox message="Could not load your statistics" visible={offline}></AlertBox>
            }
        </ScrollView>
    );
}