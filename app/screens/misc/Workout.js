// React
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput, Modal } from "react-native";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";

// Misc
import { Context} from "../../misc/Provider";
import Loader from "../../components/Loader";
import ExerciseInfoModal from "../../components/ExerciseInfoModal";
import ReArrange from "../../components/ReArrange";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import AddExercise from "../../components/AddExercise";

const WorkoutStyle = StyleSheet.create({
    infoContainer : {
        backgroundColor: Var.black
    }
})
export default function Workout() {
    const {token, workout, setWorkout} = useContext(Context);

    const navigation = useNavigation();

    const [cancelModal, setCancelModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [doneModal, setDoneModal] = useState(false);
    const [importModal, setImportModal] = useState(false);

    if (!workout) return <Loader></Loader>;

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
            <ScrollView>
                {
                workout.id ? 
                    <Pressable
                        style={MainStyle.secondaryButton}
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
                    :
                    <TextInput 
                        style={MainStyle.input} 
                        value={workout.name} 
                        onChangeText={text => setWorkout({...workout, name: text})}>
                    </TextInput>
                }
                <Modal
                    visible={doneModal}
                    transparent={true}
                    animationType="fade">
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}></View>
                    </View>
                </Modal>
                {workout.plan?.map((exercise, exerciseIndex) => (
                    <View key={exerciseIndex} style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <View style={MainStyle.inlineContainer}>
                                <ReArrange
                                    index={exerciseIndex}
                                    list={workout.plan}
                                    onMove={newList => setWorkout(prev => ({...prev, plan : newList}))}>
                                </ReArrange>
                                {typeof exercise.id == "string" || exercise.id === null ? 
                                <TextInput
                                    style={MainStyle.input}
                                    value={exercise.name}
                                    onChangeText={text => updateExerciseName(exerciseIndex, text)}>
                                </TextInput>
                                : 
                                <ExerciseInfoModal
                                    id={exercise.id}
                                    name={`${exerciseIndex+1}. ${exercise.name}`}/>
                                }
                            </View>
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
                                    <Text style={MainStyle.lightText}>x</Text>
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
                    ownIndex={workout.ownIndex}
                    Close={() => setSearchModal(false)}>
                </AddExercise> 
                <Pressable
                    style={MainStyle.button}
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
                                    fetch("http://localhost:4000/workouts", {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type" : "application/json",
                                            "Authorization" : token
                                        },
                                        body: JSON.stringify({
                                            name: workout.name,
                                            plan: workout.plan,
                                            started_at: workout.started_at,
                                            ended_at: dayjs().format("YYYY-MM-DD HH:mm:ss")
                                        })
                                    })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            navigation.navigate("Home");
                                            setDoneModal(false);
                                            setWorkout(null);
                                        }
                                    })
                                }}>
                                <Text style={MainStyle.buttonText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <View style={MainStyle.inlineContainer}>
                <Pressable
                    style={[MainStyle.button, MainStyle.buttonBlock]}
                    onPress={() => setDoneModal(true)}>
                    <Text style={[MainStyle.buttonText, WorkoutStyle.button]}>Done</Text>
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
                                onPress={() => {
                                    navigation.navigate("Home");
                                    setCancelModal(false);
                                    setWorkout(null);
                                }}>
                                <Text style={MainStyle.buttonText}>Yes</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Pressable
                    style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}
                    onPress={() => setCancelModal(true)}>
                    <Text style={MainStyle.buttonText}>Cancel</Text>
                </Pressable>
                {/*
                <Modal
                    visible={infoModal}
                    transparent={true}
                    animationType="fade">
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}>
                            {exerciseInfos ?
                            <View style={[MainStyle.container, WorkoutStyle.infoContainer]}>
                                {exerciseInfos.type && <Text style={MainStyle.containerTitle}>Type: {exerciseInfos.type}</Text>}
                                {exerciseInfos.muscle_groups && <Text style={MainStyle.screenAltTitle}>Muscle groups worked</Text>}
                                {exerciseInfos.muscle_groups && Object.entries(exerciseInfos.muscle_groups).map(([role, muscle_groups]) => (
                                    <View
                                        key={role}
                                        style={MainStyle.content}>
                                        <Text style={[MainStyle.screenAltTitle]}>{role} </Text>
                                        {muscle_groups.map((mg, mgIndex) => (
                                            <Text key={mgIndex} style={[MainStyle.lightText]}>{mg}</Text>
                                        ))}
                                    </View>
                                ))}
                            </View> : null}
                            {workoutInfos ? 
                            <View>
                                <View style={[MainStyle.container, WorkoutStyle.infoContainer]}>
                                    <Text style={MainStyle.containerTitle}>Types</Text>
                                    {workoutInfos.types && workoutInfos.types.map((type, typeIndex) => (
                                        <Text
                                            key={typeIndex}
                                            style={MainStyle.lightText}>
                                            {type.type} - {type.exercises} exercises - {type.sets} sets
                                        </Text>
                                    ))}
                                </View>
                                <View style={[MainStyle.container, WorkoutStyle.infoContainer]}>
                                    <Text style={MainStyle.containerTitle}>Muscle groups</Text>
                                    {workoutInfos.muscle_groups && workoutInfos.muscle_groups.map((mg, mgIndex) => (
                                        <Text
                                            key={mgIndex}
                                            style={MainStyle.lightText}>
                                            {mg.muscle_group} - {mg.sets} sets
                                        </Text>
                                    ))}
                                    {workoutInfos.custom && <Text style={MainStyle.lightText}>Custom - {workoutInfos.custom} sets</Text>}
                                </View>
                            </View> : null}
                            <Pressable
                                style={MainStyle.button}
                                onPress={() => {setInfoModal(false); setExerciseInfos(null); setWorkoutInfos(null)}}>
                                <Text style={[MainStyle.buttonText, WorkoutStyle.button]}>Exit</Text>
                            </Pressable> 
                        </View>
                    </View>
                </Modal>
                */}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}