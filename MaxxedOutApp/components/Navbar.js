import { useNavigation } from "@react-navigation/native";
import { View, Button } from "react-native-web";

export default function Navbar() {
    const navigation = useNavigation();

    return (
        <View>
            <Button onPress={() => {navigation.navigate("TrackerScreen")}}>
                Tracker
            </Button>
            <Button onPress={() => {navigation.navigate("SettingsScreen")}}>
                Settings
            </Button>
        </View>
    );
}

