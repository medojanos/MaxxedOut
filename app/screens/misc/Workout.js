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
                if (data.success) setWorkout(Array.from(data.data, exercise => ({id: exercise.id, name: exercise.name, sets: Array.from({length: exercise.sets}, () => ({"kg": 0, "rep": 0}))})));
            });
    }, [planId]);

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                {workout ? console.log(workout) : null}
                {workout?.map(exercise => (
                    <View key={exercise.id} style={MainStyle.container}>
                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                        {
                            exercise.sets?.map((_, index) => (
                                <View 
                                    key={exercise.id}
                                    style={MainStyle.inlineContainer}>            
                                    <Text style={MainStyle.lightText}>{index+1}</Text>
                                    <TextInput 
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="kg"/>
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput keyboardType="numeric" style={[MainStyle.input, MainStyle.setInput]} placeholder="rep"/>
                                </View>
                            ))
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