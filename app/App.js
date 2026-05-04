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
import useApiFetch from "./misc/ApiFetch";

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
    const { userData, setUserData, setWorkout} = useContext(Context);

    const apiFetch = useApiFetch();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function Load() {
            try {
                await setNotifications();

                const refreshToken = await getData("refresh_token");
                if (!refreshToken) return;
                const res = await apiFetch("/auth");
                if (!res.ok) return setUserData(null);
                setUserData(await getJson("user"));
                setWorkout(await getJson("workout"));
            }
            catch {
                const user = await getJson("user");
                if (!user) return;
                setUserData(user);
            }
            finally {
                setLoading(false);
            }
        };
        Load();
    }, [])

    if (loading) return <Loader/>;
    
    return userData ? <Main/> : <Login/>
}