// React
import { useContext, useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";

// Screens
import Login from "./screens/misc/Login";
import Main from "./Main";
import Loader from "./components/Loader";

// Misc
import { Context } from "./misc/Provider";
import { getData, getJson, } from "./misc/Storage";
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setNotifications() {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("resting-timer", {
            name: "Resting Timer",
            importance: Notifications.AndroidImportance.HIGH,
            sound: "default",
            vibrationPattern: [0, 250, 250, 250],
        });
    }
    const permissions = await Notifications.getPermissionsAsync();
    if (!permissions.granted) {
        await Notifications.requestPermissionsAsync();
    }
}

export default function App() {
    const {setToken, userData, setUserData, setWorkout} = useContext(Context);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const token = await getData("token");
                if (!token) return;
                const res = await fetch(Constants.expoConfig.extra.API_URL + "/auth", {headers: {"Authorization" : token}});
                if (res.ok) {
                    await setNotifications();
                    setToken(token);
                    setUserData(await getJson("user"));
                    setWorkout(await getJson("workout"));
                } else setUserData(undefined);
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [])

    if (loading) return <Loader/>;
    return userData ? <Main/> : <Login/>
}