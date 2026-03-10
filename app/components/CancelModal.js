// React
import { View, Text, Pressable, Modal } from "react-native";

export default function CancelModal(cancelModal, setCancelModal, setWorkout) {
    return (
        <Modal visible={cancelModal} transparent={true} animationType="fade">
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Are you sure you want to cancel this workout?</Text>
                    <Pressable style={MainStyle.secondaryButton} onPress={() => setCancelModal(false)}>
                        <Text style={MainStyle.buttonText}>No</Text>
                    </Pressable>
                    <Pressable style={MainStyle.button} onPress={() => {
                        setCancelModal(false);
                        setWorkout(null);
                    }}>
                        <Text style={MainStyle.buttonText}>Yes</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}