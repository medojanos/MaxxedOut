// React
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput } from "react-native";
import { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import AddExercise from "../../components/AddExercise";

const WorkoutStyle = StyleSheet.create({
    input : {
        width: 70,
        marginVertical: 0
    },

    title : {
        fontSize: 25,
        textAlign: "center",
        color: Var.white
    }
})
export default function Workout() {
    const {token, workout, setWorkout} = useContext(Context);

    const [searchModal, setSearchModal] = useState(false);

    function addExercise(id, name) {
        setWorkout(prev => ({
                ...prev,
                ownIndex: typeof id == "string" ? prev.ownIndex + 1 : prev.ownIndex,
                plan: [
                    ...prev.plan, 
                    {
                        id: id,
                        name: name,
                        sets: [{ kg: 0, rep: 0}]
                    }
                ]
            }));
        setSearchModal(false);
    }

    function updateExercise (exerciseIndex, setIndex, prop, value) {
        setWorkout(prev => ({
            ...prev,
            plan: Array.from(prev.plan, (ex, exi) => {
                if(exerciseIndex == exi){
                    return {...ex, sets: Array.from(ex.sets, (set, seti) => {
                        if (setIndex == seti){
                            switch(prop){
                                case "kg":
                                    return {...set, kg: value}
                                case "rep":
                                    return {...set, rep: value}
                            }  
                        }
                        else {
                            return set
                        }
                    })}
                }
                else {
                    return ex
                }
            })
        }))
    }

    function updateExerciseName(exerciseIndex, text) {
        setWorkout(prev => ({
            ...prev,
            plan : prev.plan.map((ex, exi) => {
                if (exerciseIndex == exi) {
                    return {...ex, name : text}
                }
                return ex;
            })
        }))
    }

    function deleteExercise(exerciseIndex) {
        const copy = workout.plan.filter((_, index) => exerciseIndex != index);
        setWorkout(prev => ({...prev, plan : copy}))
    }

    function addSet(exerciseIndex) {
        setWorkout(prev => ({
            ...prev,
            plan: prev.plan.map((ex, exi) => {
                if (exerciseIndex == exi) return {
                    ...ex,
                    sets: [
                        ...ex.sets,
                        {
                            kg: 0, rep: 0
                        }
                    ]
                }
                else return ex;
            })
        }))
    }

    function deleteSet(exerciseIndex, setIndex) {
        setWorkout(prev => ({
            ...prev,
            plan: prev.plan.map((ex, exi) => {
                if (exerciseIndex == exi) return {
                    ...ex,
                    sets: ex.sets.filter((_, seti) => setIndex != seti)
                }
                else return ex;
            })
        }));
    }
    return (
        <SafeAreaView style={MainStyle.content}>
        {console.log(workout)}
            <ScrollView>
                <Text style={MainStyle.screenTitle}>{workout.name}</Text>
                {workout.plan?.map((exercise, exerciseIndex) => (
                    <View key={`${exercise}${exerciseIndex}`} style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            {typeof exercise.id == "string" ? 
                            <TextInput
                                style={MainStyle.input}
                                value={exercise.name}
                                onChangeText={text => updateExerciseName(exerciseIndex, text)}>
                            </TextInput>
                            :  
                            <Text style={MainStyle.containerTitle}>{exercise.name}</Text>}
                            <Pressable onPress={() => deleteExercise(exerciseIndex)}>
                                <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                            </Pressable>
                        </View>
                        {
                            exercise.sets?.map((_, setIndex) => (
                                <View 
                                    key={setIndex}
                                    style={MainStyle.inlineContainer}>            
                                    <Text style={MainStyle.lightText}>{`${setIndex+1}.`}</Text>
                                    <TextInput 
                                        value={workout.plan[exerciseIndex].sets[setIndex].kg ? workout.plan[exerciseIndex].sets[setIndex].kg.toString() : ""}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="kg"
                                        onChangeText={text => { 
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(exerciseIndex, setIndex, "kg", text) 
                                        }}
                                    />
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput 
                                        value={workout.plan[exerciseIndex].sets[setIndex].rep ? workout.plan[exerciseIndex].sets[setIndex].rep.toString() : ""}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="rep"
                                        onChangeText={text => { 
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(exerciseIndex, setIndex, "rep", text) 
                                        }}
                                    />
                                    <Pressable
                                        onPress={() => deleteSet(exerciseIndex, setIndex)}>
                                        <Ionicons name="close" color={Var.paleWhite} size={30}></Ionicons>
                                    </Pressable>
                                </View>
                            ))
                        }
                        <Pressable
                            onPress={() => addSet(exerciseIndex)}>
                            <Ionicons name="add-circle-outline" color={Var.red} size={25} style={{margin: "auto"}}></Ionicons>
                        </Pressable>
                    </View>
                ))}
                <AddExercise
                    visible={searchModal}
                    addExercise={addExercise}
                    ownIndex={workout.ownIndex || 0}
                    Close={() => setSearchModal(false)}>
                </AddExercise> 
                <Pressable
                    style={MainStyle.secondaryButton}
                    onPress={() => setSearchModal(true)}>
                    <Text style={MainStyle.buttonText}>Add exercise</Text>
                </Pressable>
                <Pressable
                    style={MainStyle.button}
                    onPress={() => 
                        fetch("http://localhost:4000/workout", {
                                method: "PUT",
                                headers: {
                                    "Content-Type" : "application/json",
                                    "Authorization" : token
                                },
                                body: JSON.stringify({
                                    id: workout.id,
                                    name: workout.name,
                                    plan: workout.plan.map(ex => ({
                                        id: ex.id,
                                        name: ex.name,
                                        sets: ex.sets.map(set => ({
                                            kg: set.kg,
                                            rep: set.rep
                                        }))
                                    }))
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    console.log("Workout added succesfully!");
                                    setWorkout();
                                }
                    })}>
                    <Text style={MainStyle.buttonText}>Save</Text>
                </Pressable>
                <Pressable
                    style={MainStyle.secondaryButton}
                    onPress={() => setWorkout()}>
                    <Text style={MainStyle.buttonText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}