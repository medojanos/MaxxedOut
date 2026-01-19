// React
import { View, Text, Pressable, Modal, StyleSheet, ScrollView} from "react-native";
import { useContext, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Misc
import { Context } from "../misc/Provider";
import Config from "react-native-config";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const LogModalStyle = StyleSheet.create({})


export default function LogModal({visible, Close, workouts, status}) {
    const [deleteModal, setDeleteModal] = useState(false);
    const { token, Refresh } = useContext(Context);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <ScrollView>
                        {workouts ? workouts.map(workout => (
                            <View key={workout.id} style={{marginBottom: 20}}>
                                <View style={MainStyle.inlineContainer}>
                                    <Text style={MainStyle.screenTitle}>{workout.name}</Text>
                                    <Pressable
                                        onPress={() => setDeleteModal(true)}>
                                        <Ionicons name="trash" size={25} color={Var.red}/>
                                    </Pressable>
                                </View>
                                {workout.exercises.map((exercise, exerciseIndex) => (
                                    <View key={exerciseIndex} style={MainStyle.container}>
                                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                                        {exercise.sets.map((_, setIndex) => (
                                            <View key={setIndex} style={MainStyle.inlineContainer}>
                                                {exercise.sets[setIndex].weight != 0 ? <Text style={MainStyle.lightText}>Kg: {exercise.sets[setIndex].weight} </Text> : null}
                                                <Text style={MainStyle.lightText}>Rep: {exercise.sets[setIndex].rep} </Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </View> 
                        )) : <Text style={MainStyle.screenTitle}>{status}</Text>}
                    </ScrollView>
                    <Modal 
                        animationType="fade"
                        transparent={true}
                        visible={deleteModal}>
                        <View style={MainStyle.overlay}>
                            <View style={MainStyle.modal}>
                                <Text style={MainStyle.screenTitle}>Are you sure you want to delete this log?</Text>
                                <Pressable
                                    style={MainStyle.button}
                                    onPress={() => {
                                        fetch(`${Config.API_URL}/workouts/${workouts[0].id}`, {
                                            method: "DELETE",
                                            headers: {"Authorization" : token}
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.success) {
                                                Refresh();
                                                setDeleteModal(false);
                                                Close();
                                            }
                                        })
                                    }}>
                                    <Text style={MainStyle.buttonText}>Delete</Text>
                                </Pressable>
                                <Pressable
                                    style={MainStyle.secondaryButton}
                                    onPress={() => setDeleteModal(false)}>
                                    <Text style={MainStyle.buttonText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
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
