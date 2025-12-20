// React
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput, Modal } from "react-native";
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
    
})
export default function Workout() {
    const {token, workout, setWorkout} = useContext(Context);

    const [cancelModal, setCancelModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [doneModal, setDoneModal] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const [workoutInfos, setWorkoutInfos] = useState();

    function addExercise(id, name) {
        setWorkout(prev => ({
                ...prev,
                ownIndex: typeof id == "string" ? prev.ownIndex + 1 : prev.ownIndex,
                plan: [
                    ...prev.plan, 
                    {
                        id: id,
                        name: name,
                        sets: [{ weight: 0, rep: 0}]
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
                                case "weight":
                                    return {...set, weight: value}
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
                            weight: 0, rep: 0
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
            {workoutInfos ? console.log(workoutInfos) : null}
            <ScrollView>
                <View style={MainStyle.inlineContainer}>
                    {
                    workout.id ? 
                        <Text style={MainStyle.screenTitle}>{workout.name}</Text>
                        :
                        <TextInput 
                            style={MainStyle.input} 
                            value={workout.name} 
                            onChangeText={text => setWorkout({...workout, name: text})}>
                        </TextInput>
                    }
                    <Pressable
                        style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                        onPress={() => {
                            fetch("http://localhost:4000/workouts?name=" + workout.name, { headers: { Authorization: token } })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) setWorkout(prev => ({
                                    ...prev, 
                                    plan: prev.plan.map(ex => {
                                        const recentEx = data.data.find(r => r.name === ex.name);
                                        return recentEx ? {...ex, sets: recentEx.sets} : ex
                                    })
                                }));
                            })
                        }}>
                        <Text style={MainStyle.buttonText}>Import recent</Text>
                    </Pressable>
                </View>
                {workout.plan?.map((exercise, exerciseIndex) => (
                    <View key={exerciseIndex} style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            {typeof exercise.id == "string" ? 
                            <TextInput
                                style={MainStyle.input}
                                value={exercise.name}
                                onChangeText={text => updateExerciseName(exerciseIndex, text)}>
                            </TextInput>
                            :  
                            <Text style={[MainStyle.containerTitle, {margin: 0}]}>{exercise.name}</Text>}
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
                                        value={workout.plan[exerciseIndex].sets[setIndex].weight ? workout.plan[exerciseIndex].sets[setIndex].weight.toString() : ""}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="kg"
                                        onChangeText={text => { 
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(exerciseIndex, setIndex, "weight", text) 
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
                <Modal
                    visible={doneModal}
                    transparent={true}
                    animationType="fade">
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}>
                            <Text style={MainStyle.screenTitle}>Are you sure you want to save this workout?</Text>
                            <Pressable
                                style={MainStyle.secondaryButton}
                                onPress={() => setDoneModal(false)}>
                                <Text style={MainStyle.buttonText}>No</Text>
                            </Pressable>
                            <Pressable
                                style={MainStyle.button}
                                onPress={() => {
                                    fetch("http://localhost:4000/workout", {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type" : "application/json",
                                            "Authorization" : token
                                        },
                                        body: JSON.stringify({
                                            name: workout.name,
                                            plan: workout.plan
                                        })
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) setWorkout(null);
                                        setDoneModal(false);
                                    })
                                }}>
                                <Text style={MainStyle.buttonText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={MainStyle.button}
                    onPress={() => setDoneModal(true)}>
                    <Text style={MainStyle.buttonText}>Done</Text>
                </Pressable>
                <Modal
                    visible={cancelModal}
                    transparent={true}
                    animationType="fade">
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}>
                            <Text style={MainStyle.screenTitle}>Are you sure you want to cancel this workout?</Text>
                            <Pressable
                                style={MainStyle.secondaryButton}
                                onPress={() => setCancelModal(false)}>
                                <Text style={MainStyle.buttonText}>No</Text>
                            </Pressable>
                            <Pressable
                                style={MainStyle.button}
                                onPress={() => setWorkout(null)}>
                                <Text style={MainStyle.buttonText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={MainStyle.secondaryButton}
                    onPress={() => setCancelModal(true)}>
                    <Text style={MainStyle.buttonText}>Cancel</Text>
                </Pressable>
                <Modal
                    visible={infoModal}
                    transparent={true}
                    animationType="fade">
                        <View style={MainStyle.modal}>
                            <Text style={MainStyle.screenTitle}>Infos</Text>
                            {workoutInfos ? (
                            <View style={MainStyle.container}>
                                <Text style={MainStyle.lightText}>
                                    {workoutInfos.latestDate ? `You did this workout recently on ${new Date(workoutInfos.latestDate).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}` : "You haven't done this workout yet"}
                                </Text>
                                <Text style={MainStyle.lightText}>
                                    {workoutInfos.workoutCount ? `You did this workout ${workoutInfos.workoutCount} times` : ""}
                                </Text>
                                <View>
                                    {workoutInfos.exercises ? (
                                        <>
                                            {workoutInfos.exercises?.map((exercise, exerciseIndex) => (
                                                <View 
                                                    style={MainStyle.container}
                                                    key={exerciseIndex}
                                                >
                                                    <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                                                    <Text style={MainStyle.lightText}>Type: {exercise.type}</Text>
                                                    {exercise.maxWeight !== 0 ? <Text style={MainStyle.lightText}>Max weight done: {exercise.maxWeight} kg</Text> : null}
                                                    {exercise.muscle_groups?.map((musclegroup, musclegroupIndex) => (
                                                        <Text style={MainStyle.lightText} key={musclegroupIndex}>{musclegroup.muscles.length > 0 ? `${musclegroup.role}: ${musclegroup.muscles.join(",")}` : null}</Text>
                                                    ))}
                                                </View>
                                            ))}
                                        </>
                                        ) : null
                                    }
                                </View>
                            </View>
                            ) : null}
                            <Pressable
                                style={MainStyle.button}
                                onPress={() => setInfoModal(false)}>
                                <Text style={MainStyle.buttonText}>Exit</Text>
                            </Pressable>
                        </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}