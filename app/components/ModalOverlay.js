import { Modal, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import MainStyle from "../style/MainStyle";

export default function ModalOverlay({children, onClose, visible}) {
    return (
        <Modal 
            animationType="fade"
            onRequestClose={onClose}
            transparent
            visible={visible}>
            <View style={MainStyle.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                <View style={MainStyle.modal}>
                    {children}
                </View>
            </View>
            </Modal>
    )
}