// React
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";

// Misc
import PlanModal from "../../components/modals/PlanModal";
import PlanInfoModal from "../../components/modals/PlanInfoModal";
import { Context } from "../../misc/Provider";
import useApiFetch from "../../misc/ApiFetch";

//Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import AlertBox from "../../components/AlertBox";

const WorkoutsStyle = StyleSheet.create({

})

export default function Workouts() {
    const [planModal, setPlanModal] = useState(false);
    const [planInfoModal, setPlanInfoModal] = useState(false);
    const [plans, setPlans] = useState();
    const [planId, setPlanId] = useState();
    const [planName, setPlanName] = useState();

    const [alert, setAlert] = useState(false);

    const { refresh } = useContext(Context);
    
    const apiFetch = useApiFetch();
    const navigation = useNavigation();

    useEffect(() => {
        apiFetch("/plans")
        .then(res => res.json())
        .then(data => setPlans(data.data))
        .catch(() => setAlert(true))
    }, [refresh])

    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <Text style={MainStyle.screenTitle}>Workouts</Text>
            <Text style={[MainStyle.lightText, {marginBottom: 15}]}>Create or edit your workout plans</Text>
            <Pressable style={MainStyle.button} onPress={() => {navigation.navigate("CreateWorkout")}}>
                <Ionicons style={{margin: "auto"}} name="add-circle" size={50} color={Var.black}></Ionicons>
            </Pressable>
            {
                plans ? plans.length > 0 ? 
                plans.map(plan => (
                    <View key={plan.id} style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.containerTitle}>{plan.name}</Text>
                            <Pressable onPress={() => {
                                setPlanId(plan.id);
                                setPlanName(plan.name);
                                setPlanInfoModal(true);
                            }}>
                                <Ionicons name="information-circle-outline" size={25} color={Var.white}></Ionicons>
                            </Pressable>
                        </View>
                        <Pressable style={MainStyle.secondaryButton} onPress={() => {
                            setPlanId(plan.id);
                            setPlanName(plan.name);
                            setPlanModal(true);
                        }}>
                            <Text style={MainStyle.buttonText}>Edit</Text>
                        </Pressable>
                    </View>
                )) 
                : 
                <Text style={MainStyle.lightText}>Your plans will be displayed here!</Text>
                :
                <AlertBox message="Could not load workout plans" visible={alert}></AlertBox>
            }
            <PlanModal visible={planModal} Close={() => setPlanModal(false)} id={planId} name={planName}></PlanModal>
            <PlanInfoModal visible={planInfoModal} Close={() => setPlanInfoModal(false)} id={planId} name={planName}></PlanInfoModal>
        </ScrollView>
    );
}