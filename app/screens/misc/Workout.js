// React
import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { useEffect } from "react";
import { Button, FlatList, TextInput } from "react-native-web";

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

export default function Workout({workout, token, onDone}) {

    const [exercises, SetExercises] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4000/plans/" + workout.id, { headers: { Authorization: token } })
            .then(res => res.json())
            .then(data => SetExercises(data.data || []));
    }, [workout, token]);

    function renderExercise(exercise, index){
        return(
            <View style={MainStyle.container}>
                <Text style={MainStyle.containerTitle}>{index + 1}. {exercise ? exercise.name : ""}</Text>
                {[...Array(exercise.sets)].map((_ , index) => (
                    <View 
                        style={MainStyle.inlineContainer} 
                        key={index}
                    >            
                        <Text style={MainStyle.lightText}>{index+1}</Text>
                        <TextInput keyboardType="numeric" style={[MainStyle.input, WorkoutStyle.input]} placeholder="kg"/>
                        <Text style={MainStyle.lightText}>X</Text>
                        <TextInput keyboardType="numeric" style={[MainStyle.input, WorkoutStyle.input]} placeholder="rep"/>
                    </View>
                ))}
            </View>
        )
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    <Text style={WorkoutStyle.title}>
                        {workout?.name}
                    </Text>
                    <FlatList 
                        data={exercises}
                        renderItem={({item, index}) => renderExercise(item, index)}>
                    </FlatList>
                </View>
            </ScrollView>
            <Pressable
                onPress={onDone}
                style={[MainStyle.button]}>
                <Text style={MainStyle.buttonText}>Done</Text>
            </Pressable>
        </SafeAreaView>
    );
}