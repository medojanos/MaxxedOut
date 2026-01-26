// React
import { View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { useState, useEffect } from "react";

import Constants from 'expo-constants';

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
    }
})

export default function AddExercise({visible, addExercise, ownIndex, Close}) {
    const [exercises, setExercises] = useState([]);
    const [musclegroups, setMuscleGroups] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [type, setType] = useState("");
    const [musclegroup, setMuscleGroup] = useState("");
    const [mgPicker, setMgPicker] = useState(false);
    const [typePicker, setTypePicker] = useState(false);

    useEffect(() => {
        fetch(Constants.expoConfig.extra.API_URL + "/exercises")
        .then(res => res.json())
        .then(data => setExercises(data.data))

        fetch(Constants.expoConfig.extra.API_URL + "/muscle_groups")
        .then(res => res.json())
        .then(data => setMuscleGroups(data.data))
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
                    <View style={[MainStyle.inlineContainer, {zIndex: 1}]}>
                        <DropDownPicker
                            open={typePicker}
                            setOpen={setTypePicker}
                            value={type}
                            containerStyle={{width: "40%"}}
                            style={MainStyle.input}
                            textStyle={{color: Var.white}}
                            dropDownContainerStyle={{backgroundColor: Var.navyBlue}}
                            items={[
                                {label: "Type", value: ""}, 
                                {label: "Compound", value: "Compound"},
                                {label: "Isolation", value: "Isolation"}
                            ]}
                            setValue={setType}>
                        </DropDownPicker>
                        <DropDownPicker
                            open={mgPicker}
                            setOpen={setMgPicker}
                            containerStyle={{width: "50%"}}
                            style={MainStyle.input}
                            value={musclegroup}
                            textStyle={{color: Var.white}}
                            dropDownContainerStyle={{backgroundColor: Var.navyBlue}}
                            items={[
                                {label: "Muscle group", value: ""}, 
                                ...musclegroups.map(mg => (
                                    {label: mg.name, value: mg.name}
                                ))
                            ]}
                            setValue={setMuscleGroup}>
                        </DropDownPicker>
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
