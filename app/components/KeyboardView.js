import { KeyboardAvoidingView } from "react-native";

export default function KeyboardView({children, style}) {
    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={10}
            style={{ flex: 1, ...style }}>
            {children}
        </KeyboardAvoidingView>
    );
}