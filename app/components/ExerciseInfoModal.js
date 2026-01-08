// React
import { View, Text, Pressable, Modal, StyleSheet, ScrollView} from "react-native";
import { useContext, useEffect, useState } from "react";

// Misc
import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const ExerciseModalStyle = StyleSheet.create({
    
})
export default function ExerciseInfoModal({id, name}) {
    const [exerciseInfos, setExerciseInfos] = useState();
    const [visible, setVisible] = useState(false);

    const {token} = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/exercises/" + id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setExerciseInfos(data.data))
    }, []);

    return (
        <>
            <Pressable onPress={() => setVisible(true)}>
                <Text style={MainStyle.strongText}>{name}</Text>
            </Pressable>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}>
                <View style={MainStyle.overlay}>
                    <View style={MainStyle.modal}>
                        <Text style={MainStyle.screenTitle}>{exerciseInfos?.name}</Text>
                        {exerciseInfos ? (
                            <View>
                                <Text style={MainStyle.lightText}>Type: {exerciseInfos.type}</Text>
                                    <View style={MainStyle.container}>
                                        <Text style={MainStyle.containerTitle}>Muscle groups</Text>
                                        <View style={MainStyle.inlineContainer}>
                                            {Object.entries(exerciseInfos.muscle_groups).map(
                                                ([role, muscleGroups]) => (
                                                    <View key={role}>
                                                        <Text style={MainStyle.strongText}>{role}: </Text>
                                                        {muscleGroups.map(mg => (
                                                            <Text style={MainStyle.lightText} key={mg}>{mg}</Text>
                                                        ))}
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </View>
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