import { Pressable, View, Text} from "react-native";

import Style from "../style/MainStyle";

import { Context } from "../misc/Provider";
import { useContext } from "react";

export default function Settings() {
    const { setLogin } = useContext(Context);
    return (
        <View style={Style.container}>
            <Pressable onPress={() => setLogin(false)}>
                <Text>Logout</Text>
            </Pressable>
        </View>
    );
}