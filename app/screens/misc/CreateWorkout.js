import { View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";

import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { StyleSheet } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context } from "../../misc/Provider";
import Ionicons from "react-native-vector-icons/Ionicons";
import { use } from "react";
const WorkoutStyle = StyleSheet.create({

})

export default function CreateWorkout() {
    const [planName, setPlanName] = useState();
    const [exercises, setExercises] = useState();
    const {draftPlan, setDraftPlan} = useContext(Context);
    const [index, setIndex] = useState(1);
    const [searchModal, setSearchModal] = useState();
    const [exercisesDraft, setExercisesDraft] = useState(
        draftPlan || [{id: "own1", name : "Own exercise 1", set: null}]
    );

    useEffect(() => {
        fetch("http://localhost:4000/exercises")
        .then(res => setExercises(res.json()))
    },[])


    useEffect(() => {
        setDraftPlan(exercisesDraft);
    }, [exercisesDraft])

    function addExercise(type, exerciseId) {
        function setid() {
            if (type == "own") {
                setIndex(index + 1);
                return index + 1;
            } else {
                return exerciseId
            }
        }
        const id = setid();
        setExercisesDraft(prev => [...prev, {id : id, name: "Own exercise " + id, set : 0}]);
        setSearchModal(false);
    }

    function deleteExercise(index) {
        const copy = exercisesDraft.filter((_, i) => i != index);
        setExercisesDraft(copy);
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
            <TextInput placeholder="Enter workout name" style={MainStyle.input} onChangeText={setPlanName}></TextInput>
            <Pressable
                style={MainStyle.button}
                onPress={() => setSearchModal(true)}>
                <Text style={MainStyle.buttonText}>Add exercise</Text>
            </Pressable>
            <Modal 
                animationType="fade"
                transparent={true}
                visible={searchModal}>
                <View style={MainStyle.overlay}>
                    <View style={MainStyle.modal}>
                        <Text style={MainStyle.screenTitle}>Search for exercises</Text>
                        <Pressable onPress={() => addExercise("own")} style={MainStyle.secondaryButton}>
                            <Text style={MainStyle.buttonText}>Add own exercise</Text>
                        </Pressable>
                        <Pressable style={MainStyle.button} onPress={() => setSearchModal(false)}>
                            <Text style={MainStyle.buttonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>    
            {
                exercisesDraft.map((exercise, index) => {
                    return (
                        <View key={exercise.id} style={MainStyle.container}>
                            <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                            <Pressable onPress={() => deleteExercise(index)}>
                                <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                            </Pressable>
                            <TextInput style={MainStyle.input}></TextInput>
                        </View>
                    )
                })
            }
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