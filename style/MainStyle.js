import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    /* LAYOUT */
    content: {
        padding: Var.spacing.md,
        backgroundColor: Var.black,
        flexGrow: 1
    },
    container : {
        padding: Var.spacing.lg,
        backgroundColor: Var.darkGray,
        borderRadius: Var.borderRadius,
        width: "100%",
        marginVertical: Var.spacing.sm,
        borderWidth: 1,
        borderColor: Var.gray
    },
    sectionContainer: {
        marginBottom: Var.spacing.lg
    },
    callout: {
        backgroundColor: Var.red,
        borderRadius: Var.borderRadius,
        padding: Var.spacing.lg
    },
    inlineContainer : {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: Var.spacing.sm
    },
    tabBar: {
        height: 65,
        backgroundColor: Var.black,
        padding: Var.spacing.md
    },
    calendar: {
        backgroundColor: Var.darkGray,
        borderRadius: Var.borderRadius,
        padding: Var.spacing.md,
        marginBottom: Var.spacing.lg
    },
    calendarArrow: {
        backgroundColor: Var.gray,
        borderRadius: Var.borderRadius,
        padding: Var.spacing.sm
    },

    /* SPACING */
    spacingAfterSmall: {
        marginBottom: Var.spacing.sm
    },
    spacingAfterLarge: {
        marginBottom: Var.spacing.lg
    },
    spacingVerticalSmall: {
        marginVertical: Var.spacing.sm
    },
    spacingHorizontalSmall: {
        marginHorizontal: Var.spacing.sm
    },
    spacingRightSmall: {
        marginRight: Var.spacing.sm
    },
    spacingEndSmall: {
        marginEnd: Var.spacing.sm
    },
    spacingNone: {
        margin: 0
    },
    autoMargin: {
        margin: "auto"
    },
    centerVertically: {
        marginVertical: "auto"
    },
    bottomSection: {
        marginBottom: Var.spacing.lg,
        marginTop: "auto"
    },
    sectionDescription: {
        marginBottom: Var.spacing.lg
    },
    modalTitle: {
        marginBottom: Var.spacing.sm
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
        paddingVertical: Var.spacing.md,
        paddingHorizontal: Var.spacing.md,
        fontWeight: "bold"
    },

    /* BUTTONS, INPUTS */
    button : {
        backgroundColor: Var.red,
        borderRadius: Var.borderRadius,
        marginVertical: Var.spacing.sm
    },
    secondaryButton : {
        backgroundColor : Var.black,
        borderRadius : Var.borderRadius,
        borderColor: Var.gray,
        marginVertical: Var.spacing.sm,
        borderWidth: 1
    },
    buttonBlock : {
        width : Var.fontSize * 5,
    },

    input : {
        backgroundColor: Var.black,
        color: Var.white,
        padding: Var.spacing.md,
        borderRadius: Var.borderRadius,
        borderWidth: 0,
        maxWidth: "100%",
        borderColor: Var.gray,
        borderWidth: 1,
        marginVertical: Var.spacing.sm
    },
    setInput : {
        textAlign: "center",
        width : 50,
        marginVertical: 0
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
        padding: Var.spacing.lg,
        paddingBottom: Var.spacing.md,
        borderRadius: Var.borderRadius
    },
    alertBox: {
        borderRadius: Var.borderRadius,
        borderColor: Var.red,
        backgroundColor: Var.black,
        padding: Var.spacing.md,
        borderWidth: 1,
        marginVertical: Var.spacing.sm,
        width: "auto",
        margin: "auto"
    },
    divider: {
        height: 1,
        backgroundColor: Var.gray,
        marginVertical: Var.spacing.md,
    }
})