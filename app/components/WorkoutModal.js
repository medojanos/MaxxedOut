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
import { getData } from "../misc/Storage";
import { useNavigation } from "@react-navigation/native";

export default function WorkoutModal({Close, visible}) {
    const navigation = useNavigation();
    const [plans, setPlans] = useState();
    const [token, setToken] = useState();
    useEffect(() =>{
        async function getToken() {
            setToken(await getData("token"));
        }   
        getToken()
    },[])
    useEffect(() => {
        if (!token) return;
        fetch("http://localhost:4000/plans", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : token
            }
        })
        .then(res => res.json())
        .then(data => setPlans(data))
        .catch(e => console.log(e))
        },[token])  
    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={ModalStyle.modal}>
                    <Text style={MainStyle.containerTitle}>Select a workout or start a new one</Text>
                    <View>
                        <FlatList
                            data={plans}
                            renderItem={({item}) => <Pressable onPress={() => {
                                navigation.navigate("Workout");
                                Close();
                            }}>
                            <Text style={MainStyle.lightText}>{item.name}</Text></Pressable>}>
                        </FlatList>
                    </View>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}