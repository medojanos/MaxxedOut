import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Var.white
    },
    input : {
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: Var.darkGray,
        color: Var.white,
        marginBottom: 15
    },
    button : {
        backgroundColor: Var.red,
        borderWidth: 1,
        borderRadius: 5,
    }
})