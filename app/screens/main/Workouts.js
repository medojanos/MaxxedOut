// React
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import PlanModal from "../../components/PlanModal";
import PlanInfoModal from "../../components/PlanInfoModal";
import { Context } from "../../misc/Provider";

//Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
const WorkoutsStyle = StyleSheet.create({
    addPlan : {
        backgroundColor: Var.darkGray,
        alignItems: "center",
        marginVertical: 20,
        padding: 5,
        borderRadius: 5
    }
})

export default function Workouts() {
    const [planModal, setPlanModal] = useState(false);
    const [planInfoModal, setPlanInfoModal] = useState(false);
    const [plans, setPlans] = useState([]);
    const [planId, setPlanId] = useState();
    const [planName, setPlanName] = useState();

    const {token, refresh, Refresh} = useContext(Context);
    
    const navigation = useNavigation();

    useEffect(() => {
        fetch("http://localhost:4000/plans", {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setPlans(data.data))
    }, [refresh])

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    <Text style={MainStyle.screenTitle}>Workouts</Text>
                    <Text style={MainStyle.screenAltTitle}>Create or edit your workout plans</Text>
                    <Pressable style={WorkoutsStyle.addPlan} onPress={() => {navigation.navigate("CreateWorkout")}}>
                        <Ionicons name="add-circle-outline" size={50} color={Var.red}></Ionicons>
                    </Pressable>
                    {
                        plans.length > 0 ? 
                        plans.map(plan => (
                            <View key={plan.id} style={MainStyle.container}>
                                <View style={MainStyle.inlineContainer}>
                                    <Text style={MainStyle.containerTitle}>{plan.name}</Text>
                                    <Pressable onPress={() => {
                                        Refresh();
                                        setPlanId(plan.id);
                                        setPlanName(plan.name);
                                        setPlanInfoModal(true);
                                    }}>
                                        <Ionicons name="information-circle-outline" size={25} color={Var.paleWhite}></Ionicons>
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
                    }
                    <PlanModal visible={planModal} Close={() => setPlanModal(false)} id={planId} name={planName}></PlanModal>
                    <PlanInfoModal visible={planInfoModal} Close={() => setPlanInfoModal(false)} id={planId} name={planName}></PlanInfoModal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}