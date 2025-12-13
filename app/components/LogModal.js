// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";
import { FlatList, ScrollView } from "react-native-web";
import { useState, useEffect, useContext } from "react";

// Misc

import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const LogModalStyle = StyleSheet.create({
    logModal : {
        maxHeight: "80%",
    }
})

export default function LogModal({visible, Close, workouts, status}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={[MainStyle.modal, LogModalStyle.logModal]}>
                    <ScrollView>
                        {workouts?.map((workout, workoutIndex) => (
                            <View key={workout.id}>
                                <Text style={MainStyle.screenTitle}>{workout?.name || status}</Text>
                                {workout.workout.map((exercise, exerciseIndex) => (
                                    <View key={`${exercise.id ?? "custom"}${exerciseIndex}`} style={MainStyle.container}>
                                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                                        {exercise.sets.map((_, setIndex) => (
                                            <View key={`${exercise} - ${setIndex}`} style={MainStyle.inlineContainer}>
                                                <Text style={MainStyle.lightText}>Kg: {exercise.sets[setIndex].kg} </Text>
                                                <Text style={MainStyle.lightText}>Rep: {exercise.sets[setIndex].rep} </Text>
                                            </View>
                                        ))}
                                    </View>
                                    ))
                                }
                            </View> 
                        ))}
                    </ScrollView>
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