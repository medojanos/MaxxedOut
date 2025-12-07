// React
import { View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useContext } from "react";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { StyleSheet } from "react-native";
const CreateWorkoutStyle = StyleSheet.create({
    setInput : {
        width : 50,
        marginVertical : 0
    },

    listItems : {
        backgroundColor: Var.navyBlue
    }
})

export default function CreateWorkout() {
    const [searchModal, setSearchModal] = useState();
    const [exercises, setExercises] = useState([]);
    const [status, setStatus] = useState();
    const [searchText, setSearchText] = useState("");
    const [type, setType] = useState("");
    const [musclegroup, setMuscleGroup] = useState("");
    const [musclegroups, setMuscleGroups] = useState([]);

    const navigation = useNavigation();

    const {planDraft, setPlanDraft} = useContext(Context);
    const {token} = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/exercises")
        .then(res => res.json())
        .then(data => setExercises(data))
    },[])

    useEffect(() => {
        fetch("http://localhost:4000/muscle_groups")
        .then(res => res.json())
        .then(data => setMuscleGroups(data))
    },[])

    const filteredExercises = Array.isArray(exercises)
        ? exercises
        .filter(ex => ex?.name?.toLowerCase().includes(searchText.toLowerCase()))
        .filter(ex => !type || ex.type === type)
        .filter(ex => !musclegroup || ex.muscle_groups?.includes(musclegroup))
        .slice(0, 5)
    : [];

    function addExercise(exercise) {
        setPlanDraft(prev => {
            const newIndex = prev.ownIndex + 1;
            let newExercise;

            if (typeof exercise === "string") {
                newExercise = {
                    id: `own-${newIndex}`,
                    name: `Own exercise ${newIndex}`,
                    sets: 0,
                    isOwn: true,
                };
            } else {
                newExercise = {
                    id: exercise.id,
                    name: exercise.name,
                    sets: 0,
                    isOwn: false,
                };
        }

            return {
                ...prev,
                ownIndex: newIndex,
                exercises: [...prev.exercises, newExercise]
            };
        }) ;
        
        setSearchModal(false);
    }

    function deleteExercise(index) {
        const copy = planDraft.exercises.filter((_, i) => index != i);
        setPlanDraft(prev => ({...prev, exercises : copy}))
    }

    function updateExercise(index, text, prop) {
        setPlanDraft(prev => ({
            ...prev,
            exercises : prev.exercises.map((exercise, i) => {
                if (index == i) {
                    switch (prop) {
                        case "name":
                            return {...exercise, name : text}
                        case "sets":
                            return {...exercise, sets : text}
                    }
                }
                return exercise;
            })
        }))
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <TextInput 
                    placeholder="Enter workout name..." 
                    style={MainStyle.input} 
                    onChangeText={text => setPlanDraft(prev => ({...prev, name : text}))}>
                </TextInput>
                <Pressable
                    style={MainStyle.button}
                    onPress={() => setSearchModal(true)}>
                    <Text style={MainStyle.buttonText}>Add exercise</Text>
                </Pressable>
                <Text style={MainStyle.screenTitle}>{planDraft.name}</Text>
                <Text style={MainStyle.screenAltTitle}>{status}</Text>
                <Modal 
                    animationType="fade"
                    transparent={true}
                    visible={searchModal}>
                    <View style={MainStyle.overlay}>
                        <View style={MainStyle.modal}>
                            <View style={MainStyle.container}>
                                <TextInput 
                                    style={MainStyle.containerTitle}
                                    placeholder="Search for an exercise"
                                    value={searchText}
                                    onChangeText={text => setSearchText(text)}
                                    >
                                </TextInput>
                                <View>
                                    <Text>
                                        Type
                                    </Text>
                                    <Picker
                                        value={type}
                                        onValueChange={(itemValue) => setType(itemValue)}
                                    >
                                        <Picker.Item label="" value=""/>
                                        <Picker.Item label="Compound" value="Compound"/>
                                        <Picker.Item label="Isolation" value="Isolation"/>
                                    </Picker>
                                    <Text>
                                        Muscle
                                    </Text>
                                    <Picker
                                        value={musclegroup}
                                        onValueChange={(itemValue) => setMuscleGroup(itemValue)}
                                    >
                                        <Picker.Item label="" value=""/>
                                        {musclegroups.map((mg) => (
                                            <Picker.Item key={mg.id} label={mg.name} value={mg.name} />
                                        ))}
                                    </Picker>
                                </View>
                                <ScrollView>
                                    {filteredExercises?.map((exercise) => (
                                        <Pressable
                                            key={exercise.id}
                                            onPress={() => addExercise(exercise)}
                                        >
                                            <Text style={[MainStyle.lightText, CreateWorkoutStyle.listItems]}>{exercise.name}</Text>
                                        </Pressable>                                  
                                    ))}
                                </ScrollView>
                            </View>
                            <Pressable 
                                onPress={() => addExercise("own" + (planDraft.ownIndex + 1))}
                                style={MainStyle.secondaryButton}>
                                <Text style={MainStyle.buttonText}>Add own exercise</Text>
                            </Pressable>
                            <Pressable
                                style={MainStyle.button}
                                onPress={() => setSearchModal(false)}>
                                <Text style={MainStyle.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>    
                {
                    planDraft.exercises.map((exercise, index) => {
                        return (
                            <View key={`${exercise.id}-${index}`} style={MainStyle.container}>
                                <View style={MainStyle.inlineContainer}>
                                    <Text style={[MainStyle.containerTitle, {margin : 0}]}>{exercise.name}</Text>
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={[MainStyle.input, CreateWorkoutStyle.setInput]}
                                        value={planDraft.exercises[index].sets.toString()}
                                        onChangeText={text => {
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(index, text, "sets");
                                        }}>
                                    </TextInput>
                                </View>
                                {exercise.isOwn ? (
                                    <TextInput
                                        style={MainStyle.input}
                                        placeholder="Enter exercise name"
                                        value={exercise.name}
                                        onChangeText={text => updateExercise(index, text, "name")}
                                    />
                                ) : (() => {
                                    const ex = exercises.find(e => e.id === exercise.id);
                                    if(!ex) return null;
                                    return (
                                        <View>
                                            <Text style={MainStyle.lightText}>
                                                Type: {ex.type}
                                            </Text>
                                            <Text style={MainStyle.lightText}>
                                                Muscles worked: {ex.muscle_groups.join(", ")}
                                            </Text>
                                        </View>
                                    );
                                })()}
                                <Pressable onPress={() => deleteExercise(index)}>
                                    <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                                </Pressable>
                            </View>
                        )
                    })
                }
                <View style={MainStyle.inlineContainer}>
                    <Pressable
                        style={[MainStyle.button, MainStyle.buttonBlock]}
                        onPress={() => {
                            fetch("http://localhost:4000/plans", {
                                method: "PUT",
                                headers: {
                                    "Content-Type" : "application/json",
                                    "Authorization" : token
                                },
                                body: JSON.stringify({
                                    name: planDraft.name,
                                    exercises: planDraft.exercises.map(ex => ({
                                        id: ex.id,
                                        name: ex.name,
                                        sets: Number(ex.sets) || 0
                                    }))
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    setPlanDraft({name : "", ownIndex : 0, exercises : []});
                                    navigation.navigate("Home");
                                } else {
                                    setStatus(data.message);
                                }
                            })
                        }}>
                        <Text style={MainStyle.buttonText}>Save</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {setPlanDraft({name : "", ownIndex : 0, exercises : []}); navigation.navigate("Home")}}
                        style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}>
                        <Text style={MainStyle.buttonText}>Cancel</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}