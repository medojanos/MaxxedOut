import { View, Text, Pressable, TextInput, Modal, FlatList} from "react-native";

import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
import { StyleSheet } from "react-native";
const ModalStyle = StyleSheet.create({
    modal: {
        backgroundColor: Var.darkGray,
        width: "90%",
        margin: "auto",
        padding: 20,
        borderRadius: 10
    }
})

export default function PlanModal({Close, visible}) {
    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={ModalStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Edit workout plan</Text>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}