// React
import { View, Text, Pressable, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Misc
import Constants from "expo-constants";

// Style
import MainStyle from "../style/MainStyle";

export default function SaveModal( { saveModal, setSaveModal, setWorkout, body, token, setStatus }) {
    const navigation = useNavigation();

    return (
        <Modal visible={saveModal} transparent={true} animationType="fade">
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Are you sure you want to save this workout?</Text>
                    <Pressable style={MainStyle.secondaryButton} onPress={() => setSaveModal(false)}>
                        <Text style={MainStyle.buttonText}>No</Text>
                    </Pressable>
                    <Pressable style={MainStyle.button} onPress={() => {
                        console.log(body);  
                        fetch(Constants.expoConfig.extra.API_URL + "/workouts", {
                            method: "PUT",
                            headers: {
                                "Content-Type" : "application/json",
                                "Authorization" : token
                            },
                            body: JSON.stringify(body)
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                navigation.navigate("Home");
                                setSaveModal(false);
                                setWorkout(null);
                            }
                            else {
                                setStatus(data.message);
                                setSaveModal(false);
                            }
                        })
                    }}>
                        <Text style={MainStyle.buttonText}>Yes</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}