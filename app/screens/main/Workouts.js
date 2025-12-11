// React
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import PlanModal from "../../components/PlanModal";
import { Context } from "../../misc/Provider";

//Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
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

export default function Workouts() {
    const [planModal, setPlanModal] = useState(false);
    const [plans, setPlans] = useState([]);
    const [planId, setPlanId] = useState();

    const {token} = useContext(Context);
    
    const navigation = useNavigation();

    useEffect(() => {
        fetch("http://localhost:4000/plans", {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setPlans(data.data))
    }, [])

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
                        plans.map(plan => (
                            <View key={plan.id} style={MainStyle.container}>
                                <Text style={MainStyle.containerTitle}>{plan.name}</Text>
                                <Pressable style={MainStyle.secondaryButton} onPress={() => {
                                    setPlanId(plan.id);
                                    setPlanModal(true);
                                }}>
                                    <Text style={MainStyle.buttonText}>Edit</Text>
                                </Pressable>
                            </View>
                        ))
                    }
                    <PlanModal visible={planModal} Close={() => setPlanModal(false)} id={planId}></PlanModal>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}