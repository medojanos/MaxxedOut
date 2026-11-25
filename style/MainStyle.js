import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    /* LAYOUT */
    content: {
        padding: 10,
        backgroundColor: Var.black,
        flexGrow: 1
    },
    container : {
        padding: 20,
        backgroundColor: Var.darkGray,
        borderRadius: Var.borderRadius,
        width: "100%",
        marginVertical : 5,
        borderWidth: 1,
        borderColor: Var.gray
    },
    inlineContainer : {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5
    },

    /* HEADINGS */
    titleText : {
        color: Var.white,
        fontSize: Var.fontSize * 1.8,
        fontWeight: "bold"
    },
    screenTitle : {
        color: Var.white,
        fontSize : Var.fontSize * 1.6,
        fontWeight: "bold"
    },
    containerTitle : {
        color: Var.white,
        fontSize: Var.fontSize * 1.2,
        fontWeight: "bold"
    },

    /* TEXT */
    lightText : {
        color: Var.white,
        fontSize: Var.fontSize
    },
    strongText : {
        color: Var.white,
        fontSize: Var.fontSize,
        fontWeight: "bold"
    },
    quoteText : {
        fontStyle: "italic", 
        textAlign: "center",
        color: Var.white,
        fontSize: Var.fontSize * 1.1
    },

    link : {
        color: Var.red,
        textDecorationLine: "underline"
    },
    buttonText : {
        textAlign: "center",
        color: Var.white,
        margin: 10,
        fontWeight: "bold"
    },

    /* BUTTONS, INPUTS */
    button : {
        backgroundColor: Var.red,
        borderRadius: Var.borderRadius,
        marginVertical: 5
    },
    secondaryButton : {
        backgroundColor : Var.black,
        borderRadius : Var.borderRadius,
        borderColor: Var.gray,
        marginVertical: 5,
        borderWidth: 1
    },
    buttonBlock : {
        width : Var.fontSize * 5,
    },

    input : {
        backgroundColor: Var.black,
        color: Var.white,
        padding: 10,
        borderRadius: Var.borderRadius,
        borderWidth: 0,
        maxWidth: "100%",
        borderColor: Var.gray,
        borderWidth: 1
    },
    setInput : {
        textAlign: "center",
        width : 50
    },

    /* COMPONENTS */
    overlay : {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    modal: {
        maxHeight: "100%",
        backgroundColor: Var.darkGray,
        padding: 20, 
        paddingBottom: 10, 
        borderRadius: Var.borderRadius
    },
    alertBox: {
        borderRadius: Var.borderRadius,
        borderColor: Var.red,
        backgroundColor: Var.black,
        paddingVertical: 20,
        paddingHorizontal: 30,
        borderWidth: 1,
        marginVertical: 10,
        width: "auto",
        margin: "auto"
    },
    line : {
        borderWidth: 0.5,
        borderColor:'black',
        margin:10,
    }
})