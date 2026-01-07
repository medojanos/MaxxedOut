// React
import { View, Text, Pressable, Modal, StyleSheet, ScrollView} from "react-native";
import { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

// Misc
import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const ExerciseModalStyle = StyleSheet.create({
    
})
export default function ExerciseModal({id, name}) {
    const [exerciseInfos, setExerciseInfos] = useState();
    const [visible, setVisible] = useState(false);

    const {token} = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/exercises/" + id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setExerciseInfos(data.data))
    });

    return (
        <>
            <Pressable onPress={() => setVisible(true)}>
                <Text style={MainStyle.containerTitle}>{name}</Text>
            </Pressable>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}>
                <View style={MainStyle.overlay}>
                    <View style={MainStyle.modal}>
                        <Text>{name}</Text>
                        {exerciseInfos ? (
                            <View>
                                <Text style={MainStyle.lightText}>Type: {exerciseInfos.type}</Text>
                                {typeof id !== "string" && exerciseInfos.muscle_groups ? (
                                    <View>
                                        <Text style={MainStyle.lightText}>Muscle groups</Text>

                                        {Object.entries(exerciseInfos.muscle_groups).map(
                                            ([role, muscleGroups]) => (
                                                <View
                                                    style={MainStyle.inlineContainer}
                                                    key={role}
                                                >
                                                    <Text>{role}: </Text>
                                                    {muscleGroups.map(mg => (
                                                        <Text key={mg}>{mg}</Text>
                                                    ))}
                                                </View>
                                            )
                                        )}
                                    </View>
                                ) : null}
                            </View>
                        ) : null}
                        <Pressable style={MainStyle.button} onPress={() => setVisible(false)}>
                            <Text style={MainStyle.buttonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    )
}