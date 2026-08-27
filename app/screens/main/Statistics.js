// React
import { View, Text, ScrollView, StyleSheet, TextInput } from "react-native";
import { useContext, useEffect, useState } from "react";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';
import AlertBox from "../../components/AlertBox";
import useApiFetch from "../../misc/ApiFetch";

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
    },
    listItems : {
        backgroundColor: Var.navyBlue,
        padding: 5,
        fontSize: 15,
        color: Var.white,
    }
})

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
    const [weight, setWeight] = useState(null);
    const [offline, setOffline] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [searchText, setSearchText] = useState("");

    const apiFetch = useApiFetch();

    const {token, userData, workout, refresh} = useContext(Context);

    const filteredExercises = exercises
        .filter(ex => ex?.name?.toLowerCase().includes(searchText.toLowerCase()))
        .flat()


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
                    {onerm: exercises.find(e => e.id === 1)?.one_rep_max, weight: exercises.find(e => e.id === 1)?.weight, reps: exercises.find(e => e.id === 1)?.reps},
                    {onerm: exercises.find(e => e.id === 2)?.one_rep_max, weight: exercises.find(e => e.id === 2)?.weight, reps: exercises.find(e => e.id === 2)?.reps}, 
                    {onerm: exercises.find(e => e.id === 3)?.one_rep_max, weight: exercises.find(e => e.id === 3)?.weight, reps: exercises.find(e => e.id === 3)?.reps}
            ]);
            if (userData?.weight) setWeight(userData.weight);
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
                {oneRepMaxes.some(max => max !== 0) ?
                    <View>
                        <View style={[MainStyle.container, {}]}>
                            <Text style={[MainStyle.strongText, {textAlign: "center"}]}>Personal records</Text>
                            <View style={MainStyle.inlineContainer}>
                                <Text style={MainStyle.lightText}>Squat: </Text>
                                <Text style={MainStyle.strongText}>{oneRepMaxes[0].onerm != 0 ? `${oneRepMaxes[0].weight} kg` : "No record"} {oneRepMaxes[0].reps != 0 ? `x ${oneRepMaxes[0].reps}` : null}</Text>
                            </View>
                            <View style={MainStyle.inlineContainer}>
                                <Text style={MainStyle.lightText}>Bench: </Text>
                                <Text style={MainStyle.strongText}>{oneRepMaxes[1].onerm != 0 ? `${oneRepMaxes[1].weight} kg` : "No record"} {oneRepMaxes[1].reps != 0 ? `x ${oneRepMaxes[1].reps}` : null}</Text>
                            </View>
                            <View style={MainStyle.inlineContainer}>
                                <Text style={MainStyle.lightText}>Deadlift: </Text>
                                <Text style={MainStyle.strongText}>{oneRepMaxes[2].onerm != 0 ? `${oneRepMaxes[2].weight} kg` : "No record"} {oneRepMaxes[2].reps != 0 ? `x ${oneRepMaxes[2].reps}` : null}</Text>
                            </View>
                            <Text style={[MainStyle.lightText, {textAlign: "center"}]}>Best lift: <Text style={MainStyle.strongText}>{MostImpressive(...oneRepMaxes.map(max => max.onerm))}</Text></Text>
                        </View>
                        <View style={MainStyle.inlineContainer}>
                            <View style={[MainStyle.container, {width: "50%"}]}>
                                <Text style={MainStyle.strongText}>1 Rep Max</Text>
                                <Text style={MainStyle.lightText}>Squat: <Text style={MainStyle.strongText}>{oneRepMaxes[0].onerm != 0 ? `${oneRepMaxes[0].onerm} kg` : "No record"}</Text></Text>
                                <Text style={MainStyle.lightText}>Bench: <Text style={MainStyle.strongText}>{oneRepMaxes[1].onerm != 0 ? `${oneRepMaxes[1].onerm} kg` : "No record"}</Text></Text>
                                <Text style={MainStyle.lightText}>Deadlift: <Text style={MainStyle.strongText}>{oneRepMaxes[2].onerm != 0 ? `${oneRepMaxes[2].onerm} kg` : "No record"}</Text></Text>
                            </View>
                            <View style={[MainStyle.container, {width: "45%", height: "85%"}]}>
                                <Text style={[MainStyle.strongText, {textAlign: "center"}]}>Total</Text>
                                <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
                                    <Text style={[MainStyle.strongText, {textAlign: "right"}]}>{oneRepMaxes[0].onerm + oneRepMaxes[1].onerm + oneRepMaxes[2].onerm} kg</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }
                
                <View style={MainStyle.container}>
                    <Text style={MainStyle.strongText}>Total volume lifted</Text>
                    <Text style={MainStyle.lightText}>{statistics.totalWeight} kg</Text>
                </View>

                <View style={MainStyle.container}>
                    <Text style={MainStyle.strongText}>Stats for every exercise</Text>
                    <View style={[MainStyle.inlineContainer]}>
                        <Text style={MainStyle.lightText}>Search for exercises</Text>
                        <TextInput 
                            style={MainStyle.input}
                            placeholder="Enter exercise name..."
                            value={searchText}
                            onChangeText={setSearchText}>
                        </TextInput>
                    </View>
                    <ScrollView 
                        style={{maxHeight: 120, borderRadius: 10}}>
                        {filteredExercises.map((exercise) => (
                            exercise.weight && exercise.id !== 1 && exercise.id !== 2 && exercise.id !== 3 ? <Text id={exercise.id} style={[MainStyle.lightText, StatisticsStyle.listItems]}>{exercise.name} - {exercise.weight}kg x {exercise.reps} - {exercise.one_rep_max}kg</Text> : null
                        ))}
                    </ScrollView>
                </View>
            </View> 
            :
            <AlertBox message="Could not load your statistics" visible={offline}></AlertBox>
            }
        </ScrollView>
    );
}