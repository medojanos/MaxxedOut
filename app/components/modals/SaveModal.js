// React
import { Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Misc
import Constants from "expo-constants";
import ModalOverlay from "../ModalOverlay";
import useApiFetch from "../../misc/ApiFetch";

// Style
import MainStyle from "../../style/MainStyle";

export default function SaveModal( { saveModal, setSaveModal, setWorkout, body, setStatus }) {
    const navigation = useNavigation();
    const apiFetch = useApiFetch();

    return (
        <ModalOverlay visible={saveModal} onClose={() => setSaveModal(false)}>
            <Text style={MainStyle.screenTitle}>Are you sure you want to save this workout?</Text>
            <Pressable style={MainStyle.secondaryButton} onPress={() => setSaveModal(false)}>
                <Text style={MainStyle.buttonText}>No</Text>
            </Pressable>
            <Pressable style={MainStyle.button} onPress={() => { 
                apiFetch("/workouts", {
                    method: "POST",
                    body: JSON.stringify(body)
                })
                .then(async res => {
                    if (res.ok) {
                        navigation.navigate("Home");
                        setWorkout(null);
                    } 
                    else {
                        const data = await res.json();
                        setStatus(data.error);
                    }
                    setSaveModal(false);
                });
            }}>
                <Text style={MainStyle.buttonText}>Yes</Text>
            </Pressable>
        </ModalOverlay>
    )
}