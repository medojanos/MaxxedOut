import { Modal, View, TouchableWithoutFeedback, StyleSheet } from "react-native";
import MainStyle from "../style/MainStyle";
import KeyboardView from "./KeyboardView";

export default function ModalOverlay({children, onClose, visible}) {
    return (
        <Modal 
            animationType="fade"
            onRequestClose={onClose}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>
                <KeyboardView style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <View style={MainStyle.modal}>
                        {children}
                    </View>
                </KeyboardView>
            </View>
        </Modal>
    )
}