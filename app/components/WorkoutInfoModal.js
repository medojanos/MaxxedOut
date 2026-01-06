// React
import { View, Text, Pressable, Modal, StyleSheet, TextInput, ScrollView} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect, useContext } from "react";

// Misc
import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const WorkoutInfoModalStyle = StyleSheet.create({

})

export default function WorkoutInfoModal({Close, visible, id, name}) {
    const [workoutInfos, setWorkoutInfos] = useState();
    
    const {token} = useContext(Context);
    
    useEffect(() => {
        fetch("http://localhost:4000/plan-info/" + id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setWorkoutInfos(data.data))
    }, [id])

    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            {workoutInfos ? console.log(workoutInfos) : null}
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>{name} info</Text>
                    <View style={MainStyle.container}>
                        {workoutInfos.muscle_groups ? <Text style={MainStyle.containerTitle}>Muscle groups</Text> : null}
                        {workoutInfos.muscle_groups ? workoutInfos.muscle_groups.map(mg => (
                            <View style={MainStyle.inlineContainer}>
                                <Text style={MainStyle.lightText}>{mg.muscle_group}</Text>
                                <Text style={MainStyle.lightText}>{mg.sets}</Text>
                            </View>
                        ))
                        : 
                        null
                        } 
                    </View>
                    <View style={MainStyle.container}>
                        {workoutInfos.types ? <Text style={MainStyle.containerTitle}>Types</Text> : null}
                        {workoutInfos.types ? workoutInfos.types.map(type => (
                            <View style={MainStyle.inlineContainer}>
                                <Text style={MainStyle.lightText}>{type.type}</Text>
                                <Text style={MainStyle.lightText}>{type.sets}</Text>
                            </View>
                        )) 
                        : 
                        null
                        } 
                    </View>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}