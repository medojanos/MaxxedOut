import { KeyboardAvoidingView } from "react-native";

export default function KeyboardView({children}) {
    return (
        <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1 }}>
            {children}
        </KeyboardAvoidingView>
    );
}