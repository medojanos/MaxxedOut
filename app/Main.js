// React
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";

// Main Screens
import Statistics from "./screens/main/Statistics";
import Logs from "./screens/main/Logs";
import Tracker from "./screens/main/Tracker";
import Workouts from "./screens/main/Workouts";
import Settings from "./screens/main/Settings";
// Misc Screens
import Workout from "./screens/misc/Workout"
import CreateWorkout from "./screens/misc/CreateWorkout"

// Misc 
import { Context } from "./misc/Provider";

// Style
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Var from "./style/Variables";
import MainStyle from "./style/MainStyle";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home() {
  const {userData} = useContext(Context);
  return (
    <Tab.Navigator
        initialRouteName="Tracker"
        screenOptions={({ route }) => ({
          headerTitle: "MaxxedOut",
          headerStatusBarHeight: Platform.OS == "android" ? 20 : 0,
          headerStyle: { backgroundColor: Var.black, borderWidth: 1 },
          headerTitleStyle: { color: Var.white, fontSize: 30},

          tabBarStyle: { height: 65, backgroundColor: Var.black, padding: 5},
          tabBarActiveTintColor: Var.red,
          tabBarInactiveTintColor: Var.paleWhite,
          tabBarIconStyle: {height: userData.preferences?.bottomTabText == "Show" ? 30 : 50},
          tabBarShowLabel: userData.preferences?.bottomTabText == "Show" ? true : false,
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
  const {workout} = useContext(Context);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => ({
          headerStyle : {backgroundColor: Var.darkGray},
          headerBackButtonDisplayMode : "generic",
          headerTintColor: Var.white
        })}>
        <Stack.Screen name="Home" component={Home} options={{header: () => null}}/>
        <Stack.Screen name="CreateWorkout" component={CreateWorkout} options={{headerTitle: "Create New Workout", headerBackButtonDisplayMode: "minimal", headerTitleStyle: MainStyle.strongText}}/>
        <Stack.Screen name="Workout" component={Workout} options={{headerBackButtonDisplayMode: "minimal", headerTitle: workout?.name, headerTitleStyle: MainStyle.screenTitle}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}