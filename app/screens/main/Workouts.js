import { View, Text, ScrollView, Pressable, Modal, FlatList } from "react-native";

import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { StyleSheet } from "react-native";
const WorkoutsStyle = StyleSheet.create({
    addPlan : {
        borderWidth: 1,
        backgroundColor: Var.darkGray,
        flex: 1,
        alignItems: "center",
        marginVertical: 20,
        padding: 5,
        borderRadius: 5
    }
})

import Ionicons from "react-native-vector-icons/Ionicons";
import PlanModal from "../../components/PlanModal";
import { useState, useEffect } from "react";
import { getData } from "../../misc/Storage";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Workouts() {
    const [planModal, setPlanModal] = useState(false);
    const [plans, setPlans] = useState();
    const [token, setToken] = useState();
    const navigation = useNavigation();

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

    function displayPlan(plan) {
        return (
            <View style={MainStyle.container}>
                <Text style={MainStyle.containerTitle}>{plan.name}</Text>
                <Pressable style={MainStyle.secondaryButton} onPress={() => {if (!planModal) setPlanModal(true)}}>
                    <Text style={MainStyle.buttonText}>Edit</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
            <View>
                <Text style={MainStyle.screenTitle}>Workouts</Text>
                <Text style={MainStyle.screenAltTitle}>Create or edit your workout plans</Text>
                <Pressable style={WorkoutsStyle.addPlan} onPress={() => {navigation.navigate("CreateWorkout")}}>
                    <Ionicons name="add-circle-outline" size={50} color={Var.red}></Ionicons>
                </Pressable>
                <View>
                    <FlatList
                        data={plans}
                        renderItem={({item}) => displayPlan(item)}>
                    </FlatList>
                </View>
                <PlanModal visible={planModal} Close={() => setPlanModal(false)} navigation={navigation}></PlanModal>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}