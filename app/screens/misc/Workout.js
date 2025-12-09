// React
import { View, ScrollView, StyleSheet, Text, Pressable, TextInput } from "react-native";
import { useContext, useEffect } from "react";
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
        fetch("http://localhost:4000/plans/" + workout.id, { headers: { Authorization: token } })
            .then(res => res.json())
            .then(data => {
                if (data.success) setWorkout(prev => ({...prev, plan: Array.from(data.data, exercise => ({id: exercise.id, name: exercise.name, sets: Array.from({length: exercise.sets}, () => ({"kg": 0, "rep": 0}))}))}));
            });
    }, [workout.id]);

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <Text style={MainStyle.screenTitle}>{workout.name}</Text>
                {workout.plan?.map((exercise, index) => (
                    <View key={`${exercise}${index}`} style={MainStyle.container}>
                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                        {
                            exercise.sets?.map((_, index) => (
                                <View 
                                    key={index}
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
                    onPress={() => setWorkout()}>
                    <Text style={MainStyle.buttonText}>Cancel</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}