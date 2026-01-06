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
export default function ExerciseModal({visible, Close, id}) {
    const [exercise, setExercise] = useState();

    useEffect(() => {
        // Fetch exercise details
    }, [id]);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Pressable style={MainStyle.button} onPress={Close}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}