// React
import { Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Misc
import Constants from "expo-constants";
import ModalOverlay from "../ModalOverlay";

// Style
import MainStyle from "../../style/MainStyle";

export default function SaveModal( { saveModal, setSaveModal, setWorkout, body, token, setStatus }) {
    const navigation = useNavigation();

    return (
        <ModalOverlay visible={saveModal} onClose={() => setSaveModal(false)}>
            <Text style={MainStyle.screenTitle}>Are you sure you want to save this workout?</Text>
            <Pressable style={MainStyle.secondaryButton} onPress={() => setSaveModal(false)}>
                <Text style={MainStyle.buttonText}>No</Text>
            </Pressable>
            <Pressable style={MainStyle.button} onPress={() => { 
                fetch(Constants.expoConfig.extra.API_URL + "/workouts", {
                    method: "PUT",
                    headers: {
                        "Content-Type" : "application/json",
                        "Authorization" : token
                    },
                    body: JSON.stringify(body)
                })
                .then(res => {
                    if (res.ok) {
                        navigation.navigate("Home");
                        setSaveModal(false);
                        setWorkout(null);
                    } else {
                        setStatus(data.message);
                        setSaveModal(false);
                    }
                })
            }}>
                <Text style={MainStyle.buttonText}>Yes</Text>
            </Pressable>
        </ModalOverlay>
    )
}