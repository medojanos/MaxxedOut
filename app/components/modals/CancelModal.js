// React
import { Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Misc
import ModalOverlay from "../ModalOverlay";

// Style
import MainStyle from "../../style/MainStyle";

export default function CancelModal({ cancelModal, setCancelModal, setWorkout }) {
    const navigation = useNavigation();
    
    return (
        <ModalOverlay visible={cancelModal} onClose={() => setCancelModal(false)}>
            <Text style={MainStyle.screenTitle}>Are you sure you want to cancel this workout?</Text>
            <Pressable style={MainStyle.secondaryButton} onPress={() => setCancelModal(false)}>
                <Text style={MainStyle.buttonText}>No</Text>
            </Pressable>
            <Pressable style={MainStyle.button} onPress={() => {
                navigation.navigate("Home");
                setCancelModal(false);
                setWorkout(null);
            }}>
                <Text style={MainStyle.buttonText}>Yes</Text>
            </Pressable>
        </ModalOverlay>
    )
}