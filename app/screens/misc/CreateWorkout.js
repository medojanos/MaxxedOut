// React
import { View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
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
    }
})

export default function CreateWorkout() {
    const [searchModal, setSearchModal] = useState();
    const [exercises, setExercises] = useState();
    const navigation = useNavigation();

    const {planDraftSave, setPlanDraftSave} = useContext(Context);

    const [planDraft, setPlanDraft] = useState(planDraftSave ||
        {planName : "", ownIndex : 0, exercises : []}
    );

    useEffect(() => {
        fetch("http://localhost:4000/exercises")
        .then(res => setExercises(res.json()))
    },[])


    useEffect(() => {
        setPlanDraftSave(planDraft);
    }, [planDraft])

    function addExercise(id) {
        setPlanDraft(prev => {
            let exerciseName = "";
            let newIndex = prev.ownIndex + 1;
            if (typeof id == "string") {
                exerciseName = "Own exercise " + newIndex;
            } else {
                exercises[id];
            }
            return {
                ...prev,
                ownIndex : newIndex,
                exercises : [
                    ...prev.exercises,
                    {id : id, name : exerciseName, set : 0}
                ]
            }
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
                        case "set":
                            return {...exercise, set : text}
                    }
                }
            })
        }))
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <TextInput 
                    placeholder="Enter workout name..." 
                    style={MainStyle.input} 
                    onChangeText={text => setPlanDraft(prev => ({...prev, planName : text}))}>
                </TextInput>
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
                            <Text style={MainStyle.screenTitle}>Search for an exercise</Text>
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
                            <View key={exercise.id} style={MainStyle.container}>
                                <View style={MainStyle.inlineContainer}>
                                    <Text style={[MainStyle.containerTitle, {margin : 0}]}>{exercise.name}</Text>
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={[MainStyle.input, CreateWorkoutStyle.setInput]}
                                        value={planDraft.exercises[index].set}
                                        onChangeText={text => {
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(index, text, "set");
                                        }}>
                                    </TextInput>
                                </View>
                                {typeof exercise.id == "string" ? 
                                    <TextInput
                                        style={MainStyle.input}
                                        placeholder="Enter exercise name"
                                        onChangeText={text => updateExercise(index, text, "name")}>
                                    </TextInput> : ""}
                                <Pressable onPress={() => deleteExercise(index)}>
                                    <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                                </Pressable>
                            </View>
                        )
                    })
                }
                <View style={MainStyle.inlineContainer}>
                    <Pressable style={[MainStyle.button, MainStyle.buttonBlock]}>
                        <Text style={MainStyle.buttonText}>Save</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {setPlanDraftSave(null); navigation.navigate("Home")}}
                        style={[MainStyle.secondaryButton, MainStyle.buttonBlock]}>
                        <Text style={MainStyle.buttonText}>Cancel</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}