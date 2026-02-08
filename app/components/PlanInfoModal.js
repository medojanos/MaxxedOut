// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";
import { useState, useEffect, useContext } from "react";

// Misc
import { Context } from "../misc/Provider";
import Constants from 'expo-constants';

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"

export default function PlanInfoModal({ Close, visible, id, name }) {
    const [planInfo, setPlanInfo] = useState();
    
    const { token, refresh } = useContext(Context);
    
    useEffect(() => {
        fetch(`${Constants.expoConfig.extra.API_URL}/plans/info/${id}`, { headers: { "Authorization": token } })
            .then(res => res.json())
            .then(data => setPlanInfo(data.data))
    }, [id, refresh])

    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>{name} Details</Text>  
                    <View style={[MainStyle.inlineContainer, { marginVertical: 10 }]}>
                        <Text style={MainStyle.lightText}>Total exercises: {planInfo?.totalExercises}</Text>
                        <Text style={MainStyle.lightText}>Total sets: {planInfo?.totalSets}</Text>
                    </View>
                    <Text style={[MainStyle.containerTitle, { marginVertical: 10 }]}>Muscle groups</Text>
                    {planInfo?.muscle_groups.map((mg, index) => (
                        <View key={index} style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.lightText}>{mg.muscle_group}</Text>
                            <Text style={MainStyle.lightText}>{mg.sets} sets</Text>
                        </View>
                    ))}
                    <Text style={[MainStyle.containerTitle, { marginVertical: 10 }]}>Types</Text>
                    {planInfo?.types.map((type, index) => (
                        <View key={index} style={MainStyle.inlineContainer}>
                            <Text style={MainStyle.lightText}>{type.type}</Text>
                            <Text style={MainStyle.lightText}>{type.exercises} exercise</Text>
                            <Text style={MainStyle.lightText}>{type.sets} sets</Text>
                        </View>
                    ))}
                    <Pressable style={MainStyle.button} onPress={Close}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}