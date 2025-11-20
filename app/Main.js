// React
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Style
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Var from "./style/Variables";
import MainStyle from "./style/MainStyle";

// Main Screens
import Statistics from "./screens/main/Statistics";
import Logs from "./screens/main/Logs";
import Tracker from "./screens/main/Tracker";
import Workouts from "./screens/main/Workouts";
import Settings from "./screens/main/Settings";
// Misc Screens
import Workout from "./screens/misc/Workout"
import CreateWorkout from "./screens/misc/CreateWorkout"

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
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
        })}>
        <Tab.Screen name="Statistics" component={Statistics} />
        <Tab.Screen name="Logs" component={Logs} />
        <Tab.Screen name="Tracker" component={Tracker} />
        <Tab.Screen name="Workouts" component={Workouts} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
  )
}

export default function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={() => ({
        headerStyle : {backgroundColor: Var.darkGray},
        headerTitleStyle : {color: Var.red}
      })}>
        <Stack.Screen name="Tabs" component={Tabs} options={{header: () => null}}/>
        <Stack.Screen name="CreateWorkout" component={CreateWorkout}/>
        <Stack.Screen name="Workout" component={Workout}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}