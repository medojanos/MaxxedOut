// React
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput } from "react-native";
import { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"

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

export default function Workout() {
    const {token, workout, setWorkout} = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/plans/" + workout, { headers: { Authorization: token } })
            .then(res => res.json())
            .then(data => {
                if (data.success) setWorkout(data.data);
            });
    }, [id]);

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                {workout.sets.map((exercise, index) => (
                    <View 
                        style={MainStyle.inlineContainer} 
                        key={exercise.id}>            
                        <Text style={MainStyle.lightText}>{index+1}</Text>
                        <TextInput 
                            keyboardType="numeric"
                            style={MainStyle.setInput}
                            placeholder="kg"/>
                        <Text style={MainStyle.lightText}>X</Text>
                        <TextInput keyboardType="numeric" style={[MainStyle.input, WorkoutStyle.input]} placeholder="rep"/>
                    </View>
                ))}
            </ScrollView>
            <Pressable
                style={MainStyle.button}>
                <Text style={MainStyle.buttonText}>Save</Text>
            </Pressable>
            <Pressable
                style={MainStyle.secondaryButton}
                onPress={() => setWorkout(null)}>
                <Text style={MainStyle.buttonText}>Cancel</Text>
            </Pressable>
        </SafeAreaView>
    );
}