import { View, Text, ScrollView, Pressable, Modal } from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const WorkoutsStyle = StyleSheet.create({
    addPlan : {
        borderWidth: 1,
        backgroundColor: Var.darkGray,
        flex: 1,
        alignItems: "center",
        marginVertical: 20,
        borderRadius: 5
    }
})

import Ionicons from "react-native-vector-icons/Ionicons";
import PlanModal from "../components/PlanModal";
import { useState, useEffect } from "react";
import { getData } from "../misc/Storage";

export default function Workouts() {
    const [planModal, setPlanModal] = useState(false);
    const [token, setToken] = useState();
    useEffect(() =>{
        async function fetchPlans() {
            setToken(await getData("token"))
        }   
        fetchPlans()
    },[])
    useEffect(() => {
        fetch("http://localhost:4000/plans", {
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : token
            }
        })
        .then(res => res.json())
        .then(data => setExercises(data))
        .catch(e => console.log(e))
    },[token])
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <Text style={MainStyle.screenTitle}>Workouts</Text>
                <Text style={MainStyle.screenAltTitle}>Create or edit your workout plans</Text>
                <Pressable 
                    style={WorkoutsStyle.addPlan}
                    onPress={() => {if (!planModal) setPlanModal(true)}}>
                    <Ionicons name="add-circle" size={50} color={Var.red}></Ionicons>
                </Pressable>
                <PlanModal visible={planModal} Close={() => setPlanModal(false)}></PlanModal>
            </View>
        </ScrollView>
        
    );
}