import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    content: {
        padding: 20,
        flex: 1,
        backgroundColor: Var.black,
        width : "100%"
    },

    container : {
        padding: 20,
        backgroundColor: Var.darkGray,
        borderWidth: 1,
        borderColor: Var.red,
        borderRadius: 10,
        width: "100%",
        marginVertical : 20
    },
    containerTitle : {
        color: Var.white,
        fontSize: 20,
        marginBottom: 20
    },

    inlineContainer : {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 10
    },

    screenTitle : {
        color: Var.white,
        fontSize : 25
    },
    screenAltTitle : {
        color: Var.paleWhite,
        fontSize : 15
    },
    
    button : {
        backgroundColor: Var.red,
        borderRadius: 10,
        padding: 10,
        marginVertical : 10
    },
    buttonText : {
        textAlign: "center",
        color: Var.white
    },

    lightText : {
        color: Var.white,
        fontSize: Var.fontSize
    },

    input : {
        backgroundColor: Var.navyBlue,
        borderColor: Var.red,
        color: Var.white,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5
    }
})