// React
import { View, Text, Pressable, Modal, StyleSheet, TextInput, ScrollView} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";

// Misc
import AddExercise from "./AddExercise";
import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const PlanModalStyle = StyleSheet.create({

})

export default function PlanModal({Close, visible, id, name}) {
    const [plan, setPlan] = useState({id: 0, name: "", ownIndex: 0, exercises: []});
    const [deleteModal, setDeleteModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);

    const {token, setRefresh} = useContext(Context);
    
    useEffect(() => {
        fetch("http://localhost:4000/plans/" + id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setPlan({id: id, name: name, ownIndex: 0, exercises: data.data}))
    }, [id])

    function addExercise(id, name) {
        setPlan(prev => ({
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

    function updateExercise(index, text, prop) {
        setPlan(prev => ({
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

    function updateExercise(index, text, prop) {
        setPlan(prev => ({
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

    function deleteExercise(index) {
        setPlan(prev => ({...prev, exercises : prev.exercises.filter((_, i) => index != i)}))
    }

    function updateExerciseName(exerciseIndex, text) {
        setPlan(prev => ({
            ...prev,
            exercises : prev.exercises.map((ex, exi) => {
                if (exerciseIndex == exi) {
                    return {...ex, name : text}
                }
                return ex;
            })
        }))
    }

    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                   <TextInput style={MainStyle.input} value={plan.name} onChangeText={text => setPlan(prev => ({...prev, name: text}))}></TextInput>
                    <Text style={MainStyle.screenAltTitle}>Edit workout plan</Text>
                    <Pressable style={MainStyle.button} onPress={() => setSearchModal(true)}><Text style={MainStyle.buttonText}>Add exercise</Text></Pressable>
                    <ScrollView>
                        {plan?.exercises.map((exercise, index) => (
                            <View key={index} style={MainStyle.container}>
                                <View key={index} style={MainStyle.inlineContainer}>
                                    {typeof exercise.id == "string" || exercise.id == null ? 
                                    <TextInput
                                        style={[MainStyle.input, {width: "60%"}]}
                                        value={exercise.name}
                                        onChangeText={text => updateExerciseName(index, text)}>
                                    </TextInput>
                                    :  
                                    <Text style={[MainStyle.containerTitle, {margin: 0}]}>{exercise.name}</Text>}
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        value={plan.exercises[index].sets.toString()}
                                        onChangeText={text => {
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(index, text, "sets");
                                        }}>
                                    </TextInput>
                                    <Pressable onPress={() => deleteExercise(index)}>
                                        <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <AddExercise
                        visible={searchModal}
                        addExercise={addExercise}
                        ownIndex={plan.ownIndex}
                        Close={() => setSearchModal(false)}>
                    </AddExercise>
                    <Pressable style={MainStyle.secondaryButton} onPress={() => {setDeleteModal(true)}}><Text style={MainStyle.buttonText}>Delete workout plan</Text></Pressable>
                    <Modal
                        animationType="fade"
                        visible={deleteModal}
                        transparent={true}
                        onRequestClose={() => setDeleteModal(false)}>
                        <View style={MainStyle.overlay}>
                            <View style={MainStyle.modal}>
                                <Text style={MainStyle.screenTitle}>Are you sure you want to delete <Text style={{fontStyle: "italic"}}>{name}</Text>?</Text>
                                <Pressable style={MainStyle.button} onPress={() => {
                                    fetch("http://localhost:4000/plans/" + id, {method: "DELETE", headers: {"Authorization" : token}})
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            setDeleteModal(false);
                                            setRefresh(prev => prev + 1);
                                            Close();
                                        }
                                    })
                                }}><Text style={MainStyle.buttonText}>Yes, delete workout plan</Text></Pressable>
                                <Pressable style={MainStyle.secondaryButton} onPress={() => setDeleteModal(false)}><Text style={MainStyle.buttonText}>No, go back</Text></Pressable>
                            </View>
                        </View>
                    </Modal>
                    <View style={MainStyle.inlineContainer}>
                        <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                            fetch("http://localhost:4000/plans/" + id, {
                                method: "PATCH",
                                headers: {
                                    "Authorization" : token,
                                    "Content-Type" : "application/json"
                                },
                                body: JSON.stringify(plan)
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    setRefresh(prev => prev + 1);
                                    Close();
                                }
                            })
                        }}><Text style={MainStyle.buttonText}>Save</Text></Pressable>
                        <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}