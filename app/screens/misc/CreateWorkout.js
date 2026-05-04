// React
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext } from "react";

// Misc
import { Context } from "../../misc/Provider";
import AddExercise from "../../components/AddExercise";
import ExerciseInfoModal from "../../components/modals/ExerciseInfoModal";
import ReArrange from "../../components/ReArrange";
import Constants from 'expo-constants';
import KeyboardView from "../../components/KeyboardView";
import useApiFetch from "../../misc/ApiFetch";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"

export default function CreateWorkout() {
    const [searchModal, setSearchModal] = useState();
    const [status, setStatus] = useState();

    const navigation = useNavigation();
    const apiFetch = useApiFetch();

    const {planDraft, setPlanDraft, token, Refresh} = useContext(Context);

    function addExercise(id, name, type, muscle_groups) {
        if (planDraft.exercises.some(ex => ex.name == name)) return setStatus("Exercise already added");
        setPlanDraft(prev => ({
                ...prev,
                ownIndex: typeof id == "string" ? prev.ownIndex + 1 : prev.ownIndex,
                exercises: [
                    ...prev.exercises, 
                    {
                        id: id,
                        name: name,
                        type: type || "Custom",
                        muscle_groups: muscle_groups || [],
                        sets: ""
                    }
                ]
            }));
        setSearchModal(false);
    }

    function deleteExercise(index) {
        setPlanDraft(prev => ({...prev, exercises : prev.exercises.filter((_, i) => index != i)}))
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
                            return {...exercise, sets : Number(text)}
                    }
                }
                return exercise;
            })
        }))
    }

    return (
        <KeyboardView>
            <ScrollView contentContainerStyle={MainStyle.content}>
                {status ? <Text style={MainStyle.lightText}>{status}</Text> : null}
                <TextInput 
                    placeholder="Enter workout name..." 
                    value={planDraft.name || ""}
                    style={MainStyle.input} 
                    onChangeText={text => { 
                        setPlanDraft(prev => ({...prev, name : text}));
                        setStatus();
                    }}>
                </TextInput>
                <Pressable
                    style={MainStyle.button}
                    onPress={() => {
                        setSearchModal(true);
                    }}>
                    <Text style={MainStyle.buttonText}>Add exercise</Text>
                </Pressable>
                <AddExercise
                    visible={searchModal}
                    addExercise={addExercise}
                    ownIndex={planDraft.ownIndex}
                    Close={() => setSearchModal(false)}>
                </AddExercise> 
                {
                    planDraft.exercises.map((exercise, index) => {
                        return (
                            <View key={index} style={MainStyle.container}>
                                <View style={MainStyle.inlineContainer}>
                                    <ReArrange
                                        index={index}
                                        list={planDraft.exercises}
                                        onMove={newList => setPlanDraft(prev => ({...prev, exercises : newList}))}>
                                    </ReArrange>
                                    { typeof exercise.id !== "string" ?
                                    <ExerciseInfoModal
                                        id={exercise.id}
                                        name={exercise.name}
                                        maxWidth={"50%"}
                                    />
                                    : 
                                    <Text style={[MainStyle.strongText, {flexGrow: 1, maxWidth: "50%"}]}>{exercise.name}</Text>
                                    }
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        value={planDraft.exercises[index].sets}
                                        placeholder="set"
                                        onFocus={() => {}}
                                        onChangeText={text => {
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(index, text, "sets");
                                        }}>
                                    </TextInput>
                                    <Pressable onPress={() => deleteExercise(index)}>
                                        <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                                    </Pressable>
                                </View>
                                {typeof exercise.id == "string" ? (
                                    <TextInput
                                        style={MainStyle.input}
                                        placeholder="Enter exercise name..."
                                        value={exercise.name}
                                        onChangeText={text => updateExercise(index, text, "name")}/>
                                ) : null}
                            </View>
                        )
                    })
                }
                <View style={MainStyle.inlineContainer}>
                    <Pressable
                        style={[MainStyle.button, MainStyle.buttonBlock]}
                        onPress={() => {
                            apiFetch("/plans", {
                                method: "POST",
                                body: JSON.stringify({
                                    name: planDraft.name,
                                    exercises: planDraft.exercises.map((ex, index) => ({
                                        id: ex.id,
                                        name: ex.name,
                                        sets: ex.sets,
                                        position: index
                                    }))
                                })
                            })
                            .then(async res => {
                                if (res.ok) {
                                    Refresh();
                                    setPlanDraft({name : "", ownIndex : 0, exercises : []});
                                    navigation.navigate("Home");
                                } else {
                                    const data = await res.json();
                                    setStatus(data.error);
                                }
                            })
                            .catch(() => setStatus("Network error"))
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
        </KeyboardView>
    );
}
