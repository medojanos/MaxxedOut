// React
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { FlatList } from "react-native-web";

const WorkoutStyle = StyleSheet.create({
    input : {
        width: 70,
        marginVertical: 0
    },

    title : {
        fontSize: 25,
        textAlign: "center",
        color: Var.white
    }
})
export default function Workout({planId}) {
    const {token, workout, setWorkout} = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/plans/" + planId, { headers: { Authorization: token } })
            .then(res => res.json())
            .then(data => {
                if (data.success) setWorkout(data.data);
            });
    }, [planId]);

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                {workout ? console.log(Array.from(workout, exercise => ({name: exercise.name, sets: Array.from({length: exercise.sets}, () => ({"kg": 0, "rep": 0}))}))) : null};
                {workout?.map(exercise => (
                    <View key={exercise.id} style={MainStyle.container}>
                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                        {
                            workout.sets?.map((set, index) => {
                                <View 
                                    key={set}
                                    style={MainStyle.inlineContainer}>            
                                    <Text style={MainStyle.lightText}>{index+1}</Text>
                                    <TextInput 
                                        keyboardType="numeric"
                                        style={MainStyle.setInput}
                                        placeholder="kg"/>
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput keyboardType="numeric" style={MainStyle.input} placeholder="rep"/>
                                </View>
                            })
                        }
                    </View>
                ))}
                <Pressable
                style={MainStyle.button}>
                <Text style={MainStyle.buttonText}>Save</Text>
                </Pressable>
                <Pressable
                    style={MainStyle.secondaryButton}
                    onPress={() => setWorkout(null)}>
                    <Text style={MainStyle.buttonText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}