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
        padding: 5
    },
    picker : {
        backgroundColor: Var.black,
        borderColor: Var.navyBlue,
        borderWidth: 2,
        borderRadius: 5,
        color: Var.white,
        padding: 3
    },
    pickerItem : {
        color: Var.white
    }
})

export default function AddExercise({visible, addExercise, ownIndex, Close}) {
    const [exercises, setExercises] = useState([]);
    const [musclegroups, setMuscleGroups] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [type, setType] = useState("");
    const [musclegroup, setMuscleGroup] = useState("");

    useEffect(() => {
        fetch("http://localhost:4000/exercises")
        .then(res => res.json())
        .then(data => setExercises(Object.values(data)))

        fetch("http://localhost:4000/muscle_groups")
        .then(res => res.json())
        .then(data => setMuscleGroups(data))
    },[])

    const filteredExercises = exercises
        .filter(ex => ex?.name?.toLowerCase().includes(searchText.toLowerCase()))
        .filter(ex => !type || ex.type === type)
        .filter(ex => !musclegroup || ex.muscle_groups?.includes(musclegroup));

    return (
        <Modal 
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Add new exercise</Text>
                    <TextInput 
                        style={MainStyle.input}
                        placeholder="Enter exercise name..."
                        value={searchText}
                        onChangeText={setSearchText}>
                    </TextInput>
                    <View style={MainStyle.inlineContainer}>
                        <View>
                            <Text style={MainStyle.lightText}>Type</Text>
                            <Picker
                                style={AddExerciseStyle.picker}
                                selectedValue={type}
                                onValueChange={setType}>
                                <Picker.Item label="Choose type" value=""/>
                                <Picker.Item label="Compound" value="Compound"/>
                                <Picker.Item label="Isolation" value="Isolation"/>
                            </Picker>
                        </View>
                        <View>
                            <Text style={MainStyle.lightText}>Muscle</Text>
                            <Picker
                                style={AddExerciseStyle.picker}
                                selectedValue={musclegroup}
                                onValueChange={setMuscleGroup}>
                                <Picker.Item label="Choose muscle group" value=""/>
                                {musclegroups.map(mg => (
                                    <Picker.Item style={AddExerciseStyle.pickerItem} key={mg.id} label={mg.name} value={mg.name} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <ScrollView>
                        {filteredExercises.map((exercise) => (
                            <Pressable
                                key={exercise.id}
                                onPress={() => addExercise(exercise.id, exercise.name)}>
                                <Text style={[MainStyle.lightText, AddExerciseStyle.listItems]}>{exercise.name}</Text>
                            </Pressable>                                  
                        ))}
                    </ScrollView>
                    <Pressable 
                        onPress={() => addExercise("own" + (ownIndex + 1), "Own exercise " + (ownIndex + 1))}
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