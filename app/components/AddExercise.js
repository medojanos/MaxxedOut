// React
import { View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState, useEffect } from "react";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const AddExerciseStyle = StyleSheet.create({
    listItems : {
        backgroundColor: Var.navyBlue,
        padding: 5,
        fontSize: 15,
        color: Var.white,
    },
    picker : {
        backgroundColor: Var.black,
        borderColor: Var.navyBlue,
        borderWidth: 2,
        borderRadius: 5,
        color: Var.white,
        padding: 5,
        marginBottom: 10
    }
})

import Config from "react-native-config";

export default function AddExercise({visible, addExercise, ownIndex, Close}) {
    const [exercises, setExercises] = useState([]);
    const [musclegroups, setMuscleGroups] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [type, setType] = useState("");
    const [musclegroup, setMuscleGroup] = useState("");

    useEffect(() => {
        fetch(Config.API_URL + "/exercises")
        .then(res => res.json())
        .then(data => setExercises(Object.values(data)))

        fetch(Config.API_URL + "/muscle_groups")
        .then(res => res.json())
        .then(data => setMuscleGroups(data))
    },[])

    const filteredExercises = exercises
        .filter(ex => ex?.name?.toLowerCase().includes(searchText.toLowerCase()))
        .filter(ex => !type || ex.type === type)
        .filter(ex => !musclegroup || 
            Object.values(ex.muscle_groups || {})
            .flat()
            .includes(musclegroup));

    return (
        <Modal 
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Search for exercises</Text>
                    <TextInput 
                        style={MainStyle.input}
                        placeholder="Enter exercise name..."
                        value={searchText}
                        onChangeText={setSearchText}>
                    </TextInput>
                    <View style={MainStyle.inlineContainer}>
                        <Picker
                            style={AddExerciseStyle.picker}
                            selectedValue={type}
                            onValueChange={setType}>
                            <Picker.Item label="Choose type" value=""/>
                            <Picker.Item label="Compound" value="Compound"/>
                            <Picker.Item label="Isolation" value="Isolation"/>
                        </Picker>
                        <Picker
                            style={AddExerciseStyle.picker}
                            selectedValue={musclegroup}
                            onValueChange={setMuscleGroup}>
                            <Picker.Item label="Choose muscle group" value=""/>
                            {musclegroups.map(mg => (
                                <Picker.Item key={mg.id} label={mg.name} value={mg.name} />
                            ))}
                        </Picker>
                    </View>
                    <ScrollView 
                        style={{maxHeight: 120}}>
                        {filteredExercises.map((exercise) => (
                            <Pressable
                                key={exercise.id}
                                onPress={() => addExercise(exercise.id, exercise.name, exercise.type, exercise.muscle_groups)}>
                                <Text style={AddExerciseStyle.listItems}>{exercise.name}</Text>
                            </Pressable>                                  
                        ))}
                    </ScrollView>
                    <Pressable 
                        onPress={() => {
                            addExercise("own" + (ownIndex + 1), "Own exercise " + (ownIndex + 1));
                        }}
                        style={MainStyle.secondaryButton}>
                        <Text style={MainStyle.buttonText}>Add own exercise</Text>
                    </Pressable>
                    <Pressable
                        style={MainStyle.button}
                        onPress={() => Close()}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}
