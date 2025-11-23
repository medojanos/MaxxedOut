// React
import { Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Style
import MainStyle from "../style/MainStyle";

export default function Loader() {
    return (
        <SafeAreaView style={MainStyle.content}> 
                    <ScrollView contentContainerStyle={{flex : 1, justifyContent : "center", alignItems : "center"}}>
                <Text style={MainStyle.lightText}>Loading...</Text>
            </ScrollView>
        </SafeAreaView>
    )
}