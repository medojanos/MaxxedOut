// React
import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { useEffect } from "react";
import { Button, FlatList, TextInput } from "react-native-web";

const WorkoutStyle = StyleSheet.create({
    input : {
        width: 70,
        marginVertical: 0
    }
})

export default function Workout({route, navigation}) {

    const { token } = useContext(Context);
    const [exercises, SetExercises] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: route.params.text,
            headerTitleAlign: "center",
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: "bold",
                color: Var.paleWhite
            }
        });
    }, [route, navigation]);

    useEffect(() => {
        fetch("http://localhost:4000/plans/" + route.params.id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => SetExercises(data.data || []))
    }, []);

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

    function setWorkout(){

    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    <FlatList 
                        data={exercises}
                        renderItem={({item, index}) => renderExercise(item, index)}>
                    </FlatList>
                </View>
            </ScrollView>
            <Pressable
                onPress={() => {setWorkout()}}
                style={[MainStyle.button]}>
                <Text style={MainStyle.buttonText}>Done</Text>
            </Pressable>
        </SafeAreaView>
    );
}