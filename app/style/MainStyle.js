import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    content: {
        padding: 20,
        flex: 1,
        backgroundColor: Var.black
    },

    container : {
        padding: 20,
        backgroundColor: Var.darkGray,
        borderWidth: 1,
        borderColor: Var.navyBlue,
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
        justifyContent: "space-between",
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
    
    buttonBlock : {
        width : 100
    },
    button : {
        backgroundColor: Var.red,
        borderRadius: 10,
        marginVertical : 10
    },
    secondaryButton : {
        backgroundColor : Var.navyBlue,
        borderRadius : 10,
        marginVertical : 10
    },
    buttonText : {
        textAlign: "center",
        color: Var.white,
        margin: 10
    },

    lightText : {
        color: Var.white,
        fontSize: Var.fontSize
    },

    modal: {
            backgroundColor: Var.darkGray,
            width: "90%",
            margin: "auto",
            padding: 20,
            borderRadius: 10
        },

    input : {
        backgroundColor: Var.navyBlue,
        borderColor: Var.red,
        color: Var.white,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5
    },

    overlay : {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    }
})