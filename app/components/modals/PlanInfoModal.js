// React
import { View, Text, Pressable, Modal} from "react-native";
import { useState, useEffect, useContext } from "react";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';
import ModalOverlay from "../ModalOverlay";
import useApiFetch from "../../misc/ApiFetch";

// Style
import MainStyle from "../../style/MainStyle"

export default function PlanInfoModal({ Close, visible, id, name }) {
    const [planInfo, setPlanInfo] = useState();
    const [status, setStatus] = useState("");
    
    const apiFetch = useApiFetch();

    const { token, refresh } = useContext(Context);
    
    useEffect(() => {
        if (!id) return;
        apiFetch("/plans/info/" + id)
        .then(res => res.json())
        .then(data => setPlanInfo(data.data))
        .catch(() => setStatus("Network error"))
    }, [id, refresh])

    return (
        <ModalOverlay visible={visible} onClose={Close}>
            <Text style={MainStyle.screenTitle}>{name} Details</Text>  
            {status ? <Text style={MainStyle.lightText}>{status}</Text> : null}
            <View style={[MainStyle.inlineContainer, { marginVertical: 10 }]}>
                {planInfo?.totalExercises ? <Text style={MainStyle.lightText}>Total exercises: {planInfo?.totalExercises}</Text> : null }
                {planInfo?.totalSets ? <Text style={MainStyle.lightText}>Total sets: {planInfo?.totalSets}</Text> : null }
            </View>
            {planInfo?.muscle_groups?.length != 0 ? <Text style={[MainStyle.containerTitle, { marginVertical: 10 }]}>Muscle groups</Text> : null }
            {planInfo?.muscle_groups.map((mg, index) => (
                <View key={index} style={MainStyle.inlineContainer}>
                    <Text style={MainStyle.lightText}>{mg.muscle_group}</Text>
                    { mg.sets != 0 ? <Text style={MainStyle.lightText}>{mg.sets} sets</Text> : null }
                </View>
            ))}
            {planInfo?.types?.length != 0 ? <Text style={[MainStyle.containerTitle, { marginVertical: 10 }]}>Types</Text> : null}
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
        </ModalOverlay>
    )
}