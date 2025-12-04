// React
import { View, ScrollView, StyleSheet } from "react-native";
import { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Misc
import { Context } from "../misc/Provider";

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { useEffect } from "react";
const WorkoutStyle = StyleSheet.create({

})

export default function Workout({route, navigation}) {

    //const { token } = useContext(Context);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: route.params.text
        });
    }, [route, navigation]);

    /*useEffect(() => {
        fetch("http://localhost:4000/plans/" + route.params.id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => console.log(data.data))
    }, []);*/

    

    return (
        <SafeAreaView style={MainStyle.content}>
            <ScrollView>
                <View>
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}