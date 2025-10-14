import * as React from "react";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import Statistics from "../screens/Statistics";
import Logs from "../screens/Logs";
import Tracker from "../screens/Tracker";
import Workouts from "../screens/Workouts";
import Settings from "../screens/Settings";

const Tab = createBottomTabNavigator();

export default function Navbar() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Tracker">
                <Tab.Screen name="Statistics" component={Tracker}></Tab.Screen>
                <Tab.Screen name="Logs" component={Settings}></Tab.Screen>
                <Tab.Screen name="Tracker" component={Tracker}></Tab.Screen>
                <Tab.Screen name="Workouts" component={Settings}></Tab.Screen>
                <Tab.Screen name="Settings" component={Tracker}></Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}

