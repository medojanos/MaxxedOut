import { Pressable, View, Text} from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import { storeData } from "../misc/Storage";

import Style from "../misc/Style";

export default function Settings() {
    const [isLoggedIn, setLogin] = useState();
    useEffect(() => storeData("isLoggedIn", isLoggedIn), []);
    function logout() {
        useEffect(() => {
            async function set() {
                setLogin(false);
            }
            set();
        }, [])
    }
    return (
        <View style={Style.container}>
            <Pressable onPress={logout()}>
                <Text>Logout</Text>
            </Pressable>
        </View>
    );
}