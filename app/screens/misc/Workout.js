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

    function updateExercise (exerciseIndex, setIndex, prop, value) {
        setWorkout(prev => ({
            ...prev,
            plan: Array.from(prev.plan, (ex, exi) => {
                if(exerciseIndex == exi){
                    return {...ex, sets: Array.from(ex.sets, (set, seti) => {
                        if (setIndex == seti){
                            switch(prop){
                                case "kg":
                                    return {...set, kg: value}
                                case "rep":
                                    return {...set, rep: value}
                            }  
                        }
                        else {
                            return set
                        }
                    })}
                }
                else {
                    return ex
                }
            })
        }))
    }

    /*useEffect(() => {
        console.log(workout);
    }, [workout]);*/

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <Text style={MainStyle.screenTitle}>{workout.name}</Text>
                {workout.plan?.map((exercise, exerciseIndex) => (
                    <View key={`${exercise}${exerciseIndex}`} style={MainStyle.container}>
                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                        {
                            exercise.sets?.map((_, setIndex) => (
                                <View 
                                    key={setIndex}
                                    style={MainStyle.inlineContainer}>            
                                    <Text style={MainStyle.lightText}>{setIndex+1}</Text>
                                    <TextInput 
                                        value={workout.plan[exerciseIndex].sets[setIndex].kg ? workout.plan[exerciseIndex].sets[setIndex].kg.toString() : ""}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="kg"
                                        onChangeText={text => { 
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(exerciseIndex, setIndex, "kg", text) 
                                        }}
                                    />
                                    <Text style={MainStyle.lightText}>X</Text>
                                    <TextInput 
                                        value={workout.plan[exerciseIndex].sets[setIndex].rep ? workout.plan[exerciseIndex].sets[setIndex].rep.toString() : ""}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="rep"
                                        onChangeText={text => { 
                                            if (!/^\d*$/.test(text)) return;
                                            updateExercise(exerciseIndex, setIndex, "rep", text) 
                                        }}
                                    />
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