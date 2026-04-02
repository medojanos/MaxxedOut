import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    /* LAYOUT */
    content: {
        paddingHorizontal: 10,
        backgroundColor: Var.black,
        flexGrow: 1
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
    inlineContainer : {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5
    },

    /* HEADINGS */
    titleText : {
        color: Var.white,
        fontSize: Var.fontSize * 1.5,
        fontWeight: "bold"
    },
    screenTitle : {
        color: Var.white,
        fontSize : Var.fontSize * 1.3,
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
        borderRadius: 10,
        marginVertical : 10
    },
    secondaryButton : {
        backgroundColor : Var.navyBlue,
        borderRadius : 10,
        marginVertical : 10
    },
    buttonBlock : {
        width : Var.fontSize * 5,
    },

    input : {
        backgroundColor: Var.navyBlue,
        color: Var.white,
        padding: 10,
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 0,
        maxWidth: "100%"
    },
    setInput : {
        width : 50,
        marginVertical : 0,
        marginHorizontal : 5
    },

    /* COMPONENTS */
    modal: {
        backgroundColor: Var.darkGray,
        width: "90%",
        margin: "auto",
        padding: 20,
        paddingBottom: 10,
        borderRadius: 10,
        maxHeight: "80%"
    },
    overlay : {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
})