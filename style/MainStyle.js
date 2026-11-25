import * as Var from "./Variables";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    /* LAYOUT */
    content: {
        padding: Var.spacing.sm,
        backgroundColor: Var.black,
        flexGrow: 1
    },
    container : {
        padding: Var.spacing.lg,
        backgroundColor: Var.darkGray,
        borderRadius: Var.borderRadius,
        width: "100%",
        marginVertical: Var.spacing.xs,
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
        marginBottom: Var.spacing.xs
    },
    tabBar: {
        height: 65,
        backgroundColor: Var.black,
        padding: Var.spacing.xs
    },
    calendar: {
        backgroundColor: Var.darkGray,
        borderRadius: Var.borderRadius,
        padding: Var.spacing.sm,
        marginVertical: Var.spacing.lg
    },
    calendarArrow: {
        backgroundColor: Var.gray,
        borderRadius: Var.borderRadius,
        padding: Var.spacing.xs
    },

    /* SPACING */
    spacingAfterExtraSmall: {
        marginBottom: Var.spacing.xs
    },
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
    spacingEndExtraSmall: {
        marginEnd: Var.spacing.xs
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
        marginBottom: Var.spacing.md
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
        paddingVertical: Var.spacing.sm,
        paddingHorizontal: Var.spacing.sm,
        fontWeight: "bold"
    },

    /* BUTTONS, INPUTS */
    button : {
        backgroundColor: Var.red,
        borderRadius: Var.borderRadius,
        marginVertical: Var.spacing.xs
    },
    secondaryButton : {
        backgroundColor : Var.black,
        borderRadius : Var.borderRadius,
        borderColor: Var.gray,
        marginVertical: Var.spacing.xs,
        borderWidth: 1
    },
    buttonBlock : {
        width : Var.fontSize * 5,
    },

    input : {
        backgroundColor: Var.black,
        color: Var.white,
        padding: Var.spacing.sm,
        borderRadius: Var.borderRadius,
        borderWidth: 0,
        maxWidth: "100%",
        borderColor: Var.gray,
        borderWidth: 1,
        marginVertical: Var.spacing.xs
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
        padding: Var.spacing.lg,
        paddingBottom: Var.spacing.sm,
        borderRadius: Var.borderRadius
    },
    alertBox: {
        borderRadius: Var.borderRadius,
        borderColor: Var.red,
        backgroundColor: Var.black,
        paddingVertical: Var.spacing.lg,
        paddingHorizontal: Var.spacing.xl,
        borderWidth: 1,
        marginVertical: Var.spacing.sm,
        width: "auto",
        margin: "auto"
    },
    line : {
        borderWidth: 0.5,
        borderColor:'black',
        margin: Var.spacing.sm,
    }
})