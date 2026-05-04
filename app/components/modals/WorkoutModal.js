// React
import { View, Text, Pressable, StyleSheet} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';
import ModalOverlay from "../ModalOverlay";
import AlertBox from "../AlertBox";
import useApiFetch from "../../misc/ApiFetch";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
const WorkoutModalStyle = StyleSheet.create({
    workoutButton:{
        backgroundColor: Var.black,
        borderColor: Var.navyBlue,
        borderWidth: 2
    }
})

export default function WorkoutModal({Close, visible, isOffline}) {
    const [plans, setPlans] = useState();
    const [offline, setOffline] = useState(false);

    const { setWorkout, refresh } = useContext(Context);

    const apiFetch = useApiFetch();
    const navigation = useNavigation();
    
    useEffect(() => {
        apiFetch("/plans")
        .then(res => res.json())
        .then(data => setPlans(data.data))
        .catch(() => {
            setOffline(true);
            isOffline(true);
        })
    }, [refresh])

    return (
        <ModalOverlay visible={visible} onClose={Close}>
            <Text style={MainStyle.screenTitle}>Select a workout</Text>
            {
                plans ? plans.length != 0 ? 
                plans.map(plan => (
                    <Pressable 
                        key={plan.id}
                        style={[MainStyle.button, WorkoutModalStyle.workoutButton]} 
                        onPress={() => {
                            apiFetch("/plans/" + plan.id)
                            .then(res => res.json())
                            .then(data => {
                                setWorkout({id: plan.id, name: plan.name, started_at: dayjs().format("YYYY-MM-DD HH:mm:ss"), ownIndex : 0, plan: Array.from(data.data, exercise => ({id: exercise.id, name: exercise.name, sets: Array.from({length: exercise.sets}, () => ({"weight": "", "rep": ""}))}))});
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
                <AlertBox message="Could not load workout plans" visible={offline}></AlertBox>
            }
            {
                plans ?
                <Pressable
                    style={MainStyle.secondaryButton}
                    onPress={() => {
                        setWorkout({name: "New workout", plan: [], ownIndex : 0, started_at: dayjs().format("YYYY-MM-DD HH:mm:ss")});
                        Close();
                        navigation.navigate("Workout");
                    }}>
                    <Text style={MainStyle.buttonText}>Start a new one</Text>
                </Pressable> : null
            }
            <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
        </ModalOverlay>
    )
}