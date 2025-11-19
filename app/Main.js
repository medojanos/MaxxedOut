// React
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";

// Style
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Var from "./style/Variables";

// Screens
import Statistics from "./screens/main/Statistics";
import Logs from "./screens/main/Logs";
import Tracker from "./screens/main/Tracker";
import Workouts from "./screens/main/Workouts";
import Settings from "./screens/main/Settings";

const Tab = createBottomTabNavigator();

export default function Main() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Tracker"
        screenOptions={({ route }) => ({
          headerTitle: "MaxxedOut",
          headerStyle: { backgroundColor: Var.black },
          headerTitleStyle: { color: Var.white, fontSize: 30 },
          
          tabBarStyle: { height: 65, backgroundColor: Var.black, padding: 5},
          tabBarActiveTintColor: Var.red,
          tabBarInactiveTintColor: Var.paleWhite,
          tabBarIconStyle: {width: 30, height: 30},
          tabBarHideOnKeyboard : true,
          tabBarIcon: ({ color }) => {
            const icons = {
              Statistics: "stats-chart",
              Logs: "calendar",
              Tracker: "barbell",
              Workouts: "list",
              Settings: "settings",
            };
            return <Ionicons name={icons[route.name]} size={30} color={color}/>;
          },
        })}
      >
        <Tab.Screen name="Statistics" component={Statistics} />
        <Tab.Screen name="Logs" component={Logs} />
        <Tab.Screen name="Tracker" component={Tracker} />
        <Tab.Screen name="Workouts" component={Workouts} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}