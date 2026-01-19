// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

// Misc
import { Context } from "../misc/Provider";
import Constants from 'expo-constants';

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const WorkoutModalStyle = StyleSheet.create({
    workoutButton:{
        backgroundColor: Var.black,
        borderColor: Var.navyBlue,
        borderWidth: 2
    }
})

export default function WorkoutModal({Close, visible}) {
    const [plans, setPlans] = useState();

    const { token, setWorkout, refresh } = useContext(Context);
    const navigation = useNavigation();
    

    useEffect(() => {
        fetch(Constants.expoConfig.extra.API_URL + "/plans", { headers: { "Authorization": token } })
        .then(res => res.json())
        .then(data => setPlans(data.data))
    }, [refresh])


    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Select a workout</Text>
                    <View>
                        {
                            plans ? plans.length != 0 ? 
                            plans.map(plan => (
                                <Pressable 
                                    key={plan.id}
                                    style={[MainStyle.button, WorkoutModalStyle.workoutButton]} 
                                    onPress={() => {
                                        fetch(Constants.expoConfig.extra.API_URL + "/plans/" + plan.id, { headers: { Authorization: token } })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.success) setWorkout({id: plan.id, name: plan.name, started_at: dayjs().format("YYYY-MM-DD HH:mm:ss"), ownIndex : 0, plan: Array.from(data.data.plan, exercise => ({id: exercise.id, name: exercise.name, sets: Array.from({length: exercise.sets}, () => ({"weight": 0, "rep": 0}))}))});
                                        });
                                        Close();
                                        navigation.navigate("Workout");
                                }}>
                                    <Text style={MainStyle.buttonText}>{plan.name}</Text>
                                </Pressable>)) 
                            :
                            <View style={MainStyle.inlineContainer}>
                                <Text style={[MainStyle.lightText, {fontWeight: "bold"}]}>No workout plan?</Text>
                                <Pressable style={[MainStyle.button, WorkoutModalStyle.workoutButton]} onPress={() => {navigation.navigate("CreateWorkout"); Close();}}>
                                    <Text style={MainStyle.buttonText}>Create one</Text>
                                </Pressable> 
                            </View>
                            : 
                            null
                        }
                    </View>
                    <Pressable
                        style={MainStyle.secondaryButton}
                        onPress={() => {
                            setWorkout({name: "New workout", plan: [], ownIndex : 0, started_at: dayjs().format("YYYY-MM-DD HH:mm:ss")});
                            Close();
                            navigation.navigate("Workout");
                        }}>
                        <Text style={MainStyle.buttonText}>Start a new one</Text>
                    </Pressable>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}