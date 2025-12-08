// React
import { View, Text, Pressable, Modal, FlatList, StyleSheet} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

// Misc
import { Context } from "../misc/Provider";

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
    const navigation = useNavigation();
    const [plans, setPlans] = useState();
    
    const {workout, setWorkout} = useContext(Context);

    const { token } = useContext(Context);

    useEffect(() => {
        fetch("http://localhost:4000/plans", {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setPlans(data.data))
        }, [])  

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
                            plans?.map((plan) => (
                                <Pressable 
                                    key={plan.id}
                                    style={WorkoutModalStyle.workoutButton} 
                                    onPress={() => {
                                        setWorkout(plan.id);
                                        Close();
                                }}>
                                    <Text style={MainStyle.buttonText}>{plan.name}</Text>
                                </Pressable>
                            )
                        )}
                    </View>
                    <Pressable
                        style={MainStyle.secondaryButton}
                        onPress={() => {
                            setWorkout();
                            Close();
                        }}>
                        <Text style={MainStyle.buttonText}>Start a new one</Text>
                    </Pressable>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}