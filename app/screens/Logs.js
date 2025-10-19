import * as React from "react";

import { View, Text } from "react-native";

// Styles
import Style from "./Style";

export default function Logs() {
    return (
        <View style={Style.container}><Text style={Style.font}>Logs</Text></View>
    );
}