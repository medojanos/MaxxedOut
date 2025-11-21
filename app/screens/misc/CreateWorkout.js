import { View, Text, ScrollView, Pressable, TextInput } from "react-native";

import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context } from "../../misc/Provider";
import Ionicons from "react-native-vector-icons/Ionicons";
const WorkoutStyle = StyleSheet.create({

})

export default function CreateWorkout() {
    const [planName, setPlanName] = useState();
    const [exercises, setExercises] = useState();
    const {draftPlan, setDraftPlan} = useContext(Context);
    const [exercisesDraft, setExercisesDraft] = useState(
        draftPlan || [{id: null, set: null}]
    );

    useEffect(() => {
        fetch("http://localhost:4000/exercises")
        .then(res => res.json())
        .then(data => setExercises(data))
    },[])

    useEffect(() => {
        setDraftPlan(exercisesDraft);
    }, [exercisesDraft])

    function displayExercises(exercises, exercisesDraft) {
            return (exercisesDraft.map(exerciseDraft => {
                const text = exerciseDraft.id != null ? exercises[exerciseDraft.id].name : "New exercise " + exerciseDraft.id;
                <View key={exerciseDraft.id} style={MainStyle.container}>
                    <Text style={MainStyle.containerTitle}>{text}</Text>
                    <TextInput onChange={value => exercisesDraft.id = value} placeholder="Enter exercise id"></TextInput>
                </View>
            }))
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
            <TextInput placeholder="Enter workout name" style={MainStyle.input} onChangeText={setPlanName}></TextInput>
            <Pressable
                style={MainStyle.button}
                onPress={() => setExercisesDraft(prev => ([...prev, {id: null, set: null}]))}>
                <Text style={MainStyle.buttonText}>Add exercise</Text>
            </Pressable>
            {displayExercises(exercises, exercisesDraft)}
            <View style={MainStyle.inlineContainer}>
                <Pressable style={[MainStyle.button, MainStyle.buttonBlock]}>
                    <Text style={MainStyle.buttonText}>Save</Text>
                </Pressable>
                <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}>
                    <Text style={MainStyle.buttonText}>Cancel</Text>
                </Pressable>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}