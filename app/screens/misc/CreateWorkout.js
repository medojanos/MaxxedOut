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
        draftPlan == null ? [{id: null,set: null}] : draftPlan
    );

    useEffect(() => {
        setDraftPlan(exercisesDraft);
    }, [exercisesDraft])

    useEffect(() => {
        fetch("http://localhost:4000/exercises")
        .then(res => res.json())
        .then(data => setExercises(data))
    },[])

    /*function displayDraft(draft) {
        return draft.map((exercise, index) => (
                <View key={index} style={MainStyle.container}>
                    <View style={MainStyle.inlineContainer}>
                        <Text style={MainStyle.containerTitle}>
                        {exercise.id == null ? "New workout " + index :
                        exercises[exercise.id].name}
                        </Text>
                        <TextInput style={MainStyle.input}></TextInput>
                        <Pressable onPress={() => {
                            setExercisesDraft(prev => {
                                const copy = [...prev];
                                copy.splice(index, 1);
                                return copy;
                            })
                        }}>
                            <Ionicons name="trash" color={Var.red} size={20}></Ionicons>
                        </Pressable>
                    </View>
                </View>
            ))
    }*/
    
    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
            <TextInput placeholder="Enter workout name" style={MainStyle.input} onChangeText={setPlanName}></TextInput>
            <Pressable
                style={MainStyle.button}
                onPress={() => setExercisesDraft(prev => ([...prev, {id: null, set: null}]))}>
                <Text style={MainStyle.buttonText}>Add exercise</Text>
            </Pressable>
            {/*displayDraft(exercisesDraft)*/}
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