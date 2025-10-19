import * as React from "react";

import { View, Text } from "react-native";

// Styles
import Style from "./Style";

export default function Tracker() {
    return (
        <View style={Style.container}><Text style={Style.font}>Tracker</Text></View>
    );
}