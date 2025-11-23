// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const ModalStyle = StyleSheet.create({

})

export default function PlanModal({Close, visible}) {
    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Edit workout plan</Text>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}