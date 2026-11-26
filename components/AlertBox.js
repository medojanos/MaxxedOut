import {View, Text, Pressable} from "react-native";
import MainStyle from "../style/MainStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Var from "../style/Variables"

export default function AlertBox({message, heading, visible = true, onClose = () => {}}, closable = false) {
    return visible ? 
        <View style={MainStyle.alertBox}>
            {heading ? 
                <View style={MainStyle.inlineContainer}>
                    <Text style={MainStyle.containerTitle}>{heading}</Text>
                    { closable ? <Ionicons style={{marginStart: Var.spacing.sm}} name="close" size={Var.iconSizes.xs} color={Var.red} onPress={() => onClose(false)}/> : null }
                </View>
            : null }
            <View style={[MainStyle.inlineContainer, MainStyle.spacingNone]}>
                {message ? <Text style={MainStyle.lightText}>{message}</Text> : null}
                {heading || !closable ? null : <Ionicons style={{marginStart: Var.spacing.sm}} name="close" size={Var.iconSizes.xs} color={Var.red} onPress={() => onClose(false)}/>}
            </View>
        </View> : null
}