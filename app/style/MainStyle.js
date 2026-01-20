import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    content: {
        padding: 20,
        backgroundColor: Var.black,
        flexGrow: 1
    },

    titleText : {
        color: Var.white,
        fontSize: 30,
        fontWeight: "bold"
    },

    screenTitle : {
        color: Var.white,
        fontSize : 25,
        fontWeight: "bold"
    },
    screenAltTitle : {
        color: Var.paleWhite,
        fontSize : 15,
        fontWeight: "bold"
    },

    container : {
        padding: 20,
        backgroundColor: Var.darkGray,
        borderRadius: 15,
        width: "100%",
        marginVertical : 10,
        borderWidth: 1,
        borderColor: Var.navyBlue
    },
    containerTitle : {
        color: Var.white,
        fontSize: 20,
        fontWeight: "bold"
    },

    inlineContainer : {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5
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
        margin: 10,
        fontWeight: "bold"
    },

    lightText : {
        color: Var.white,
        fontSize: Var.fontSize
    },
    strongText : {
        color: Var.white,
        fontSize: Var.fontSize,
        fontWeight: "bold",
    },

    modal: {
        backgroundColor: Var.darkGray,
        width: "90%",
        margin: "auto",
        padding: 20,
        borderRadius: 10,
        maxHeight: "80%"
    },

    input : {
        backgroundColor: Var.navyBlue,
        color: Var.white,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 0
    },
    setInput : {
        width : 50,
        marginVertical : 0
    },

    overlay : {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    }
})