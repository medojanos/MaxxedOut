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
import AddExercise from "../../components/AddExercise";
const CreateWorkoutStyle = StyleSheet.create({
    setInput : {
        width : 50,
        marginVertical : 0
    }
})

export default function CreateWorkout() {
    const [searchModal, setSearchModal] = useState();
    
    const [status, setStatus] = useState();
    const navigation = useNavigation();

    const {planDraft, setPlanDraft} = useContext(Context);
    const {token} = useContext(Context);
    

    function addExercise(id, name) {
        setPlanDraft(prev => ({
                ...prev,
                ownIndex: prev.ownIndex + 1,
                exercises: [
                    ...prev.exercises, 
                    {
                        id: id,
                        name: name,
                        sets: 0
                    }
                ]
            }));
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
                <AddExercise
                    visible={searchModal}
                    addExercise={addExercise}
                    ownIndex={planDraft.ownIndex}
                    Close={() => setSearchModal(false)}>
                </AddExercise> 
                {
                    planDraft.exercises.map((exercise, index) => {
                        return (
                            <View key={exercise.id} style={MainStyle.container}>
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
                                {typeof exercise.id == "string" ? (
                                    <TextInput
                                        style={MainStyle.input}
                                        placeholder="Enter exercise name..."
                                        onChangeText={text => updateExercise(index, text, "name")}/>
                                ) : null}
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
                                        sets: ex.sets
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