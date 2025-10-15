import React from "react";
import * as Var from "./Variables";

// Components
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

// Screens
import Statistics from "./screens/Statistics";
import Logs from "./screens/Logs";
import Tracker from "./screens/Tracker";
import Workouts from "./screens/Workouts";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Tracker"
        screenOptions={({ route }) => ({
          headerTitle: "MaxxedOut",
          headerStyle: {backgroundColor: Var.darkGray},
          headerTitleStyle: {color: Var.white},
          tabBarShowLabel: false,
          tabBarStyle: {height: Var.tabBarSize, backgroundColor: Var.darkGray, borderTopWidth: 0},
          tabBarActiveTintColor: Var.red,
          tabBarInActiveTintColor: Var.white,
          tabBarIconStyle: {width: Var.iconSize, height: Var.iconSize, margin: "auto"},
          tabBarIcon: ({color}) => {
            let iconName;
            switch (route.name) {
              case "Statistics":
                iconName = "stats-chart";
                break;
              case "Logs":
                iconName = "calendar";
                break;
              case "Tracker":
                iconName = "barbell";
                break;
              case "Workouts":
                iconName = "list";
                break;
              case "Settings":
                iconName = "settings";
                break;
            }
            return <Ionicons name={iconName} size={Var.iconSize} color={color}/>;
          },
        })}>
        <Tab.Screen name="Statistics" component={Statistics}/>
        <Tab.Screen name="Logs" component={Logs} />
        <Tab.Screen name="Tracker" component={Tracker} />
        <Tab.Screen name="Workouts" component={Workouts} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
