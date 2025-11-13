import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        padding: Var.paddingSize,
        flex: 1,
        alignItems: "center",
        backgroundColor: Var.darkGray
    },
    textLight : {
        color: Var.white,
        fontSize: Var.fontSize,
        textAlign: "center"
    },
    textDark : {
        color: Var.black,
        fontSize: Var.fontSize,
        textAlign: "center"
    }
    
})