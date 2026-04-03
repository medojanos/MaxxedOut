// React
import { View, Text, Pressable, Modal, TextInput, ScrollView} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";

// Misc
import AddExercise from "../AddExercise";
import { Context } from "../../misc/Provider";
import ExerciseInfoModal from "./ExerciseInfoModal";
import ReArrange from "../ReArrange";
import Constants from 'expo-constants';
import ModalOverlay from "../ModalOverlay";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"

export default function PlanModal({ Close, visible, id, name }) {
    const [plan, setPlan] = useState({ id: 0, name: "", ownIndex: 0, exercises: [] });
    const [deleteModal, setDeleteModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);

    const { token, Refresh } = useContext(Context);
    
    useEffect(() => {
        if (!id) return;

        fetch(`${Constants.expoConfig.extra.API_URL}/plans/${id}`, { headers: { "Authorization": token } })
        .then(res => res.json())
        .then(data => setPlan({ id: id, name: name, ownIndex: 0, exercises: data.data }))
    }, [id, name, token]);

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

    function deleteExercise(index) {
        setPlan(prev => ({...prev, exercises : prev.exercises.filter((_, i) => index != i)}))
    }

    return (
        <ModalOverlay visible={visible} onClose={Close}>
            <Text style={MainStyle.screenTitle}>Edit workout plan</Text>
            <TextInput style={MainStyle.input} value={plan.name} onChangeText={text => setPlan(prev => ({...prev, name: text}))}></TextInput>
            <Pressable style={MainStyle.button} onPress={() => setSearchModal(true)}><Text style={MainStyle.buttonText}>Add exercise</Text></Pressable>
            <ScrollView>
                {plan?.exercises.map((exercise, index) => (
                    <View key={index} style={MainStyle.container}>
                        <View key={index} style={MainStyle.inlineContainer}>
                            <ReArrange
                                index={index}
                                list={plan.exercises}
                                onMove={newList => setPlan(prev => ({...prev, exercises : newList}))}>
                            </ReArrange>
                            {typeof exercise.id == "string" || exercise.id == null ? 
                            <TextInput
                                style={[MainStyle.input, {flexGrow: 1, maxWidth: "50%"}]}
                                value={exercise.name}
                                onChangeText={text => updateExercise(index, text, "name")}>
                            </TextInput>
                            :  
                            <ExerciseInfoModal
                                id={exercise.id}
                                name={exercise.name}
                                maxWidth={"50%"}
                            />
                            }
                            <Text style={MainStyle.lightText}>x</Text>
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
            <ModalOverlay visible={deleteModal} onClose={() => setDeleteModal(false)}>
                <Text style={MainStyle.screenTitle}>
                    Are you sure you want to delete
                    <Text style={{fontStyle: "italic"}}> {name}</Text> ?
                </Text>
                <Pressable style={MainStyle.secondaryButton} onPress={() => setDeleteModal(false)}>
                    <Text style={MainStyle.buttonText}>No</Text>
                </Pressable>
                <Pressable style={MainStyle.button} onPress={() => {
                    fetch(Constants.expoConfig.extra.API_URL + "/plans/" + id, {method: "DELETE", headers: {"Authorization" : token}})
                    .then(res => {
                        if (res.ok) {
                            setDeleteModal(false);
                            Refresh();
                            Close();
                        }
                    })
                }}>
                    <Text style={MainStyle.buttonText}>Yes</Text>
                </Pressable>
            </ModalOverlay>
            <View style={MainStyle.inlineContainer}>
                <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => {
                    fetch(Constants.expoConfig.extra.API_URL + "/plans/" + id, {
                        method: "PATCH",
                        headers: {
                            "Authorization" : token,
                            "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            name: plan.name,
                            exercises: plan.exercises.map((exercise, index) => ({
                                id: exercise.id,
                                sets: exercise.sets,
                                position: index
                            }))
                        })
                    })
                    .then(res => {
                        if (res.ok) {
                            Refresh();
                            Close();
                        }
                    })
                }}>
                    <Text style={MainStyle.buttonText}>Save</Text>
                </Pressable>
                <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={Close}>
                    <Text style={MainStyle.buttonText}>Close</Text>
                </Pressable>
            </View>
        </ModalOverlay>
    )
}