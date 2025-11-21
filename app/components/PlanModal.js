import { View, Text, Pressable, TextInput, Modal, FlatList} from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const ModalStyle = StyleSheet.create({
    modal: {
        backgroundColor: Var.darkGray,
        width: "90%",
        margin: "auto",
        padding: 20,
        borderRadius: 10
    }
})
import { useEffect, useState } from "react";

export default function PlanModal({Close, visible}) {
    const [planName, setPlanName] = useState();
    const [exercises, setExercises] = useState();
    useEffect(() => {
        fetch("http://localhost:4000/exercises", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(res => res.json())
        .then(data => setExercises(data))
    },[])
    return (
        <Modal 
            animationType="slide"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={ModalStyle.modal}>
                <Text style={MainStyle.screenTitle}>Create new workout plan</Text>
                <TextInput style={MainStyle.input} onChangeText={setPlanName}></TextInput>
                <FlatList
                    data={exercises}
                    renderItem={({item}) => <Text style={MainStyle.lightText}>{item.name}</Text>}>
                </FlatList>
                <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
            </View>
        </Modal>
    )
}